import "@/styles/globals.css";
import { Analytics } from '@vercel/analytics/react'; // import the package

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics /> {/* Add it here */}
    </>
  );
}
