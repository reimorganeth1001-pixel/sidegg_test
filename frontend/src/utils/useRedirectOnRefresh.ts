import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

export const useRedirectOnRefresh = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if(localStorage.getItem("status")){
        const status = JSON.parse(localStorage.getItem("status") || '');
        if(status == 3){
          const isReloaded = sessionStorage.getItem('reloaded');

          if (isReloaded) {
            sessionStorage.removeItem('reloaded');
            router.replace('/');
          }

          window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('reloaded', 'true');
          });

          localStorage.removeItem("status");
          return () => {
            window.removeEventListener('beforeunload', () => {
              sessionStorage.removeItem('reloaded');
            });
          };
        }
        else{
          return;
        }
      }
    }
  }, [router]);
};
