'use client';
import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import { useRouter } from 'next/navigation';

import { sideGG_back_Config } from '@/config';
import { UserInfoCtx } from '@/context/userInfoContext';
import { supabase } from '@/service/supabase';
import { generateToken } from '@/utils/jwt';
import { AuthCtx } from '@/context/authContext';

const Callback = () => {
  const { setUserInfoData } = useContext(
    UserInfoCtx
  )

  const { setAuthState } = useContext(AuthCtx);

  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false); 

  const init = useCallback(async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      router.push('/');
      return;
    }

    try {
      const userMetadata = data.session.user.user_metadata;

      const twitterAccount = userMetadata?.user_name;
      const userName = userMetadata?.name;
      const emailAddr = data.session.user.email;
      const phoneNumber = data.session.user.phone;
      const userPicture = userMetadata.picture;

      const response = await axios.post(
        `${sideGG_back_Config.SIDEGG_SERVER}/${sideGG_back_Config.CREAT_USER}`,
        {
          userInfo: {
            name: userName,
            email: emailAddr,
            phone: phoneNumber,
            twitter: twitterAccount
          }
        }, 
        { headers: { "Content-Type": "application/json" } } 
      );

      const userData = response.data.data;
      const userInfo = { ...userData, userPicture: userPicture };

      setUserInfoData(userInfo);

      const jwtToken = generateToken(response.data.data.id);
      localStorage.removeItem(sideGG_back_Config.SIDE_GG_TOEKN);
      localStorage.setItem(sideGG_back_Config.SIDE_GG_TOEKN, jwtToken);
 
      if(response?.data?.data?.status >= 1){
        router.push("/connect")
        setAuthState('success')
      }
      else{
        router.push('/entry');
        setAuthState('success')
      }

    } catch (error) {
      return error instanceof Error ? error.message : "Unknown Error"
    }
  }, [router, setAuthState, setUserInfoData]);

  useEffect(() => {
    if (isProcessing) return; 

    setIsProcessing(true);
    init();

    
  }, [init, isProcessing]);

  return (
    <div className="min-h-screen bg-black">
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
      </div>
    </div>
  );
};

export default Callback;
