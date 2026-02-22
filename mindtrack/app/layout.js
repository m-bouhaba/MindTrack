// app/layout.js
'use client';

import './globals.css';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { AuthProvider } from '@/context/AuthContext';

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
