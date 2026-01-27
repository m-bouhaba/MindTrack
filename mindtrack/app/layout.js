'use client';

import './globals.css';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'MindTrack',
  description: 'Smart habit & mental wellness tracker',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Provider store={store}>
            {children}
          </Provider>
        </AuthProvider>
      </body>
    </html>
  );
}
