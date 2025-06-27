import { AppProps } from 'next/app';
// import { ThemeProvider } from '../../components/ThemeProvider'; // Adjust path if needed
import '../styles/globals.css'; // Make sure the global styles are imported

function MyApp({ Component, pageProps }: AppProps) {
  return (
    
      <Component {...pageProps} />

  );
}

export default MyApp;
