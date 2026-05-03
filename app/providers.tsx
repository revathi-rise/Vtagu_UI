'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { ReactNode } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

export function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <GoogleOAuthProvider clientId="852761465276-g21622mqo3sca6sbnmdesp5rfp3ujsmc.apps.googleusercontent.com">
      <Provider store={store}>{children}</Provider>
    </GoogleOAuthProvider>
  );
}
