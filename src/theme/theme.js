import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#6B9BD1', // Soft blue
      light: '#A8C9E0',
      dark: '#4A6FA5',
    },
    secondary: {
      main: '#8FBC8F', // Dark sea green
      light: '#B8D4B8',
      dark: '#5F8C5F',
    },
    background: {
      default: '#F5F7FA', // Light grayish-blue
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C3E50', // Dark blue-gray
      secondary: '#7F8C8D', // Medium gray
    },
    success: {
      main: '#7CB342', // Light green
    },
    warning: {
      main: '#FFA726', // Light orange
    },
    error: {
      main: '#EF5350', // Light red
    },
    info: {
      main: '#29B6F6', // Light blue
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#2C3E50',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#2C3E50',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#2C3E50',
    },
    body1: {
      fontSize: '1rem',
      color: '#2C3E50',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#7F8C8D',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

