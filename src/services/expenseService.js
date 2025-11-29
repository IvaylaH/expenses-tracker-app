import { supabase } from '../lib/supabaseClient';

/**
 * Generate a unique receipt filename
 * Returns a filename like "Receipt_1234567890_ABCD.ext"
 */
const generateUniqueReceiptName = (originalFileName) => {
  // Extract file extension
  const fileExtension = originalFileName.split('.').pop();

  // Generate timestamp-based unique ID
  const timestamp = Date.now();

  // Generate random alphanumeric suffix for extra uniqueness
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `Receipt_${timestamp}_${randomSuffix}.${fileExtension}`;
};

/**
 * Check if filename contains non-ASCII characters
 */
const hasNonAsciiCharacters = (fileName) => {
  return /[^\x00-\x7F]/.test(fileName);
};

/**
 * Fetch all expenses for a specific user
 */
export const fetchUserExpenses = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('purchase_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};

/**
 * Create a new expense
 */
export const createExpense = async (expenseData) => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .insert([expenseData])
      .select();

    if (error) throw error;
    return data?.[0];
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
};

/**
 * Upload image to storage
 */
export const uploadExpenseImage = async (userId, file) => {
  try {
    // Check if filename contains non-ASCII characters
    let sanitizedFileName;
    if (hasNonAsciiCharacters(file.name)) {
      // Generate a unique receipt name for files with non-ASCII characters
      sanitizedFileName = generateUniqueReceiptName(file.name);
    } else {
      // For ASCII-only filenames, just remove special characters
      sanitizedFileName = file.name
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/_{2,}/g, '_'); // Replace multiple underscores with single underscore
    }

    const fileName = `${userId}/${Date.now()}_${sanitizedFileName}`;
    const { error: uploadError } = await supabase.storage
      .from('expense-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('expense-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Verify user exists in database
 * Users must be pre-created in the database
 */
export const getOrCreateUser = async (firstName, lastName, userId) => {
  try {
    // Verify user exists with matching firstname, lastname, and user_id
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('firstname', firstName)
      .eq('lastname', lastName)
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw new Error('User not found. Please check your credentials and try again.');
      }
      throw fetchError;
    }

    return user;
  } catch (error) {
    console.error('Error verifying user:', error);
    throw error;
  }
};

/**
 * Send data to n8n webhook
 */
export const sendToN8nWebhook = async (userData, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('firstName', userData.firstName);
    formData.append('lastName', userData.lastName);
    formData.append('userId', userData.userId);
    formData.append('imageUrl', userData.imageUrl);
    formData.append('comment', userData.comment);
    formData.append('image', imageFile);

    const response = await fetch(
      'https://ai.n8n-myacad.org/webhook/80d11f1b-d69f-401a-9c52-36d02cb05e40',
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Webhook request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending to n8n webhook:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time expense updates
 */
export const subscribeToExpenses = (userId, callback) => {
  const subscription = supabase
    .channel(`expenses:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'expenses',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();

  return subscription;
};

