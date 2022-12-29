// Must use createTheme from '@mui/material/styles' and not '@mui/system'
import '@fontsource/poppins/';

import { createTheme, responsiveFontSizes } from '@mui/material/styles';

import { customColors } from './colors';

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      info: {
        main: customColors.gray[900],
      },
    },
    typography: {
      fontFamily: ['Poppins', 'sans-serif'].join(','),
      h1: {
        fontSize: '58px',
        lineHeight: 58 / 44,
        margin: 0,
        fontWeight: 700,
      },
      h2: {
        fontSize: '38px',
        lineHeight: 44 / 38,
        margin: 0,
        fontWeight: 700,
      },
      h3: {
        fontSize: '30px',
        lineHeight: 36 / 30,
        margin: 0,
        fontWeight: 600,
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
