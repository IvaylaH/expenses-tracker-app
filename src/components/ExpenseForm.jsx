import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { uploadExpenseImage, sendToN8nWebhook } from '../services/expenseService';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ExpenseForm = ({ open, onClose, userId, firstName, lastName, onExpenseAdded }) => {
  const [comment, setComment] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError('Only JPG, JPEG, PNG, WEBP, and GIF images are allowed');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 5MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!comment.trim()) {
        setError('Comment is required');
        setLoading(false);
        return;
      }

      let imageUrl = null;

      // Upload image to Supabase bucket if provided
      if (imageFile) {
        imageUrl = await uploadExpenseImage(userId, imageFile);
      }

      // Send data to n8n webhook
      await sendToN8nWebhook({
        firstName,
        lastName,
        userId,
        imageUrl,
        comment: comment.trim(),
      }, imageFile);

      // Reset form
      setComment('');
      setImageFile(null);
      setImagePreview('');

      onExpenseAdded();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to process image');
      console.error('Image processing error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Expense</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Comment *"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            disabled={loading}
            multiline
            rows={3}
            placeholder="Add any notes about this expense..."
            required
          />

          <Box>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              disabled={loading}
            >
              Upload Image - Optional (JPG, PNG, WEBP, GIF)
              <input
                type="file"
                hidden
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
              />
            </Button>
            {imagePreview && (
              <Box
                sx={{
                  mt: 2,
                  width: '100%',
                  height: 200,
                  backgroundImage: `url(${imagePreview})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 1,
                }}
              />
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          {loading && <CircularProgress size={20} />}
          {loading ? 'Adding...' : 'Add Expense'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExpenseForm;

