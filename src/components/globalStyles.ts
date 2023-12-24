import { createGlobalStyle } from 'styled-components';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const GlobalStyle = createGlobalStyle`
  html, button, input, textarea {
    font-family: ${inter.style.fontFamily};
    font-weight: 500;
  }

  html {
    font-size: 62.5%;

    overflow: hidden;
  }

  body {
    margin: 0;
    padding: 0;

    font-size: 1.4rem;

    overflow: hidden;
  }

  * {
    box-sizing: border-box;
  }
`;

export default GlobalStyle;
