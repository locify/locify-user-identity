import {createTheme} from '@mui/material/styles';
import '@fontsource/roboto';
import {red} from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#F9FAFC',
      paper: '#FFFFFF'
    },
  },
  typography: {
    fontFamily: [
      "Roboto",
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

export default theme;
