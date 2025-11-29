import React, { useState } from 'react';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
} from '@mui/material';
import { getOrCreateUser } from '../services/expenseService';
import { showSuccessToast, showErrorToast } from '../services/toastService';

const UserIdentification = ({ onUserIdentified }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleIdentify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!firstName.trim() || !lastName.trim() || !userId.trim()) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      // Verify user exists in database
      await getOrCreateUser(firstName, lastName, userId);

      // Call the callback with user data
      onUserIdentified({
        firstName,
        lastName,
        userId,
      });

      showSuccessToast(`Welcome, ${firstName}!`);
    } catch (err) {
      const errorMessage = err.message || 'An error occurred during identification';
      setError(errorMessage);
      showErrorToast(errorMessage);
      console.error('Identification error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          py: 4,
        }}
      >
        <Card
          sx={{
            width: '100%',
            p: 4,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            variant="h2"
            sx={{
              mb: 1,
              textAlign: 'center',
              fontSize: '2rem',
            }}
          >
            Expense Tracker
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              textAlign: 'center',
              color: 'text.secondary',
            }}
          >
            Identify yourself to get started
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleIdentify} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              disabled={loading}
              placeholder="Enter your first name"
            />
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              disabled={loading}
              placeholder="Enter your last name"
            />
            <TextField
              label="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              fullWidth
              disabled={loading}
              placeholder="Enter your user ID"
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'Identifying...' : 'Continue'}
            </Button>
          </Box>
        </Card>
      </Box>
    </Container>
  );
};

export default UserIdentification;

