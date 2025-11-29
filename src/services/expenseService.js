import { supabase } from '../lib/supabaseClient';

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
    const fileName = `${userId}/${Date.now()}_${file.name}`;
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

