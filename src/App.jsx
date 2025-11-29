import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import { theme } from './theme/theme';
import UserIdentification from './components/UserIdentification';
import ExpenseForm from './components/ExpenseForm';
import ExpenseHistory from './components/ExpenseHistory';

function App() {
  const [user, setUser] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUserIdentified = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setRefreshTrigger(0);
  };

  const handleExpenseAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <UserIdentification onUserIdentified={handleUserIdentified} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #6B9BD1 0%, #4A6FA5 100%)' }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Expense Tracker - {user.firstName} {user.lastName}
            </Typography>
            <Button
              color="inherit"
              startIcon={<AddIcon />}
              onClick={() => setFormOpen(true)}
              sx={{ mr: 2 }}
            >
              Add Expense
            </Button>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
          <ExpenseHistory userId={user.userId} refreshTrigger={refreshTrigger} />
        </Container>

        <ExpenseForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          userId={user.userId}
          onExpenseAdded={handleExpenseAdded}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
