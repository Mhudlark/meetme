// Must use createTheme from '@mui/material/styles' and not '@mui/system'
import '@fontsource/poppins/';

import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const theme = responsiveFontSizes(
  createTheme({
    typography: {
      fontFamily: ['Poppins', 'sans-serif'].join(','),
      h1: {
        fontSize: '24px',
        lineHeight: 36 / 18,
        margin: 0,
        fontWeight: 500,
      },
      h2: {
        fontSize: '38px',
        lineHeight: 44 / 38,
        margin: 0,
        fontWeight: 600,
      },
      h3: {
        fontSize: '24px',
        lineHeight: 30 / 24,
        margin: 0,
        fontWeight: 500,
      },
      h4: {
        fontSize: '20px',
        lineHeight: 28 / 20,
        margin: 0,
        fontWeight: 600,
        fontFamily: ['Rubik', 'sans-serif'].join(','),
      },
      h6: {
        fontSize: '16px',
        lineHeight: 24 / 16,
        margin: 0,
        fontWeight: 600,
      },
    },
  })
);

export default theme;
