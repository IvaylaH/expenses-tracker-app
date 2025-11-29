import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Typography,
  Paper,
  Chip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { fetchUserExpenses, subscribeToExpenses } from '../services/expenseService';

const ExpenseHistory = ({ userId, refreshTrigger }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statistics, setStatistics] = useState({
    total: 0,
    byCategory: {},
    byStatus: {},
  });

  const fetchExpenses = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchUserExpenses(userId);
      setExpenses(data);
      calculateStatistics(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch expenses');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (expenseList) => {
    let total = 0;
    const byCategory = {};
    const byStatus = {};

    expenseList.forEach((expense) => {
      total += parseFloat(expense.amount) || 0;

      // By category
      if (!byCategory[expense.category]) {
        byCategory[expense.category] = 0;
      }
      byCategory[expense.category] += parseFloat(expense.amount) || 0;

      // By status
      if (!byStatus[expense.status]) {
        byStatus[expense.status] = 0;
      }
      byStatus[expense.status] += parseFloat(expense.amount) || 0;
    });

    setStatistics({
      total,
      byCategory,
      byStatus,
    });
  };

  useEffect(() => {
    fetchExpenses();
  }, [userId, refreshTrigger]);

  // Set up real-time subscription
  useEffect(() => {
    const subscription = subscribeToExpenses(userId, () => {
      fetchExpenses();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {error && <Alert severity="error">{error}</Alert>}

      {/* Statistics Section */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #6B9BD1 0%, #A8C9E0 100%)',
              color: 'white',
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Total Expenses
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
              ${statistics.total.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>

        {Object.entries(statistics.byCategory).map(([category, amount]) => (
          <Grid item xs={12} sm={6} md={3} key={`cat-${category}`}>
            <Paper
              sx={{
                p: 2,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #8FBC8F 0%, #B8D4B8 100%)',
                color: 'white',
                borderRadius: 2,
              }}
            >
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {category}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
                ${amount.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Status Summary */}
      <Card sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          By Status
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {Object.entries(statistics.byStatus).map(([status, amount]) => (
            <Chip
              key={`status-${status}`}
              label={`${status}: $${amount.toFixed(2)}`}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      </Card>

      {/* Expenses Table */}
      <Card>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Typography variant="h6">Expense History</Typography>
          <Button
            startIcon={<RefreshIcon />}
            onClick={fetchExpenses}
            disabled={loading}
            variant="outlined"
          >
            Refresh
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F5F7FA' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Merchant</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3 }}>
                    <Typography color="textSecondary">
                      No expenses recorded yet. Add your first expense!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                expenses.map((expense) => (
                  <TableRow key={expense.id} hover>
                    <TableCell>
                      {new Date(expense.purchase_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{expense.merchant}</TableCell>
                    <TableCell>
                      {expense.amount} {expense.currency}
                    </TableCell>
                    <TableCell>
                      <Chip label={expense.category} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={expense.status}
                        size="small"
                        color={expense.status === 'Completed' ? 'success' : 'warning'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {expense.image_url ? (
                        <Button
                          size="small"
                          href={expense.image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </Button>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          —
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default ExpenseHistory;

