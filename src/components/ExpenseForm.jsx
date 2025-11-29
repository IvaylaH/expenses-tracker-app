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
import { uploadExpenseImage, createExpense } from '../services/expenseService';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ExpenseForm = ({ open, onClose, userId, onExpenseAdded }) => {
  const [merchant, setMerchant] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
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
      if (!merchant.trim() || !purchaseDate || !amount || !currency.trim() || !category.trim() || !status.trim()) {
        setError('All fields except image are required');
        setLoading(false);
        return;
      }

      let imageUrl = null;

      // Upload image if provided
      if (imageFile) {
        imageUrl = await uploadExpenseImage(userId, imageFile);
      }

      // Create expense
      await createExpense({
        user_id: userId,
        image_url: imageUrl,
        merchant: merchant.trim(),
        purchase_date: new Date(purchaseDate).toISOString(),
        amount: parseFloat(amount),
        currency: currency.trim(),
        category: category.trim(),
        status: status.trim(),
      });

      // Reset form
      setMerchant('');
      setPurchaseDate('');
      setAmount('');
      setCurrency('USD');
      setCategory('');
      setStatus('');
      setComment('');
      setImageFile(null);
      setImagePreview('');

      onExpenseAdded();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add expense');
      console.error('Expense creation error:', err);
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
            label="Merchant"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            fullWidth
            disabled={loading}
            placeholder="e.g., Grocery Store"
          />

          <TextField
            label="Purchase Date"
            type="datetime-local"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            fullWidth
            disabled={loading}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            disabled={loading}
            inputProps={{ step: '0.01', min: '0' }}
            placeholder="0.00"
          />

          <TextField
            label="Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            fullWidth
            disabled={loading}
            placeholder="USD"
          />

          <TextField
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
            disabled={loading}
            placeholder="e.g., Food, Transport"
          />

          <TextField
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
            disabled={loading}
            placeholder="e.g., Pending, Completed"
          />

          <TextField
            label="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            multiline
            rows={3}
            disabled={loading}
            placeholder="Add any additional notes about this expense"
          />

          <Box>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              disabled={loading}
            >
              Upload Image (JPG, PNG, WEBP, GIF)
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

