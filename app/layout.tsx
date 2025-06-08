import './globals.css';
import type { Metadata } from 'next';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthProviderWrapper from './AuthProviderWrapper';
import { ToastContainer } from 'react-toastify';        // <-- ADD THIS
import 'react-toastify/dist/ReactToastify.css';          // <-- ADD THIS

export const metadata: Metadata = {
  title: 'Tech Shack',
  description: 'Your Digital Solutions Expert',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap"
          rel="stylesheet"
        />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <AuthProviderWrapper>
          <Navbar />
          {children}
          <Footer />
        </AuthProviderWrapper>
        <ToastContainer />   {/* <-- ADD HERE */}
      </body>
    </html>
  );
}




