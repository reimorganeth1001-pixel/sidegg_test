'use client'

import { createContext, ReactNode, useEffect, useState } from 'react';
import { authType } from '@/type';
import { useRouter } from 'next/navigation';

const defaultProvider: authType.AuthContextType = {
  authState: "pending",
  setAuthState: () => {},
};

const AuthCtx = createContext<authType.AuthContextType>(defaultProvider);

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const [authState, setAuthState] = useState<authType.AuthState>("pending");
    const router = useRouter();

  useEffect(() => {
    if(authState === 'failure') {
        router.push('/')
    }
  }, [authState])

  return (
    <AuthCtx.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthCtx.Provider>
  );
};

export { AuthCtx, AuthProvider };
