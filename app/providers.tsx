'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { ReactNode } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

export function ReduxProvider({ children }: { children: ReactNode }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Provider store={store}>{children}</Provider>
    </GoogleOAuthProvider>
  );
}
