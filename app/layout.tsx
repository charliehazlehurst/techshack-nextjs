import './globals.css';
import type { Metadata } from 'next';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './components/auth-context';  // <-- use this!
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        <AuthProvider> {/* <-- Wrap with AuthProvider here */}
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
        <ToastContainer />
      </body>
    </html>
  );
}




