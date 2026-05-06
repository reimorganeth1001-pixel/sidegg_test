'use client'

import { createContext, ReactNode, useState } from 'react';
import { loadType } from '@/type';

const defaultProvider: loadType.LoadContextType = {
  loading: false,
  setLoading: () => {},
};

const LoadingCtx = createContext<loadType.LoadContextType>(defaultProvider);

type Props = {
  children: ReactNode;
};

const LoadingProvider = ({ children }: Props) => {
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading);
  
  return (
    <LoadingCtx.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingCtx.Provider>
  );
};

export { LoadingCtx, LoadingProvider };
