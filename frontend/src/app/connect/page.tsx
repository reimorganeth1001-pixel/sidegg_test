'use client';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ConnectWallet from '@/components/ConnectWallet';
import { UserInfoCtx } from '@/context/userInfoContext';
import { AuthCtx } from '@/context/authContext';
import Loading from '@/components/Loading';

export default function Connect() {

  const { authState } = useContext(AuthCtx);
  const router = useRouter();

  const { userInfoData } = useContext(
    UserInfoCtx
  )

  // useEffect(() => {
  //   if(!userInfoData.id) router.push("/");
  // }, [userInfoData])
  

  const handleConnect = () => {
    // Add your wallet connection logic here
    // Once connected, navigate to chat
    router.push('/chat');
  };

  // const handleDisclaimerClick = () => {
  //   // Handle disclaimer navigation
  //   router.push('/disclaimer');
  // };

  useEffect(() => {
    if(authState == 'failure')
      router.push('/')
  }, [authState])

  useEffect(() => {
    if(authState == "success" && userInfoData.status < 1)
      router.push('/entry');
  }, [authState])


  if (authState === "pending")
    return (
      <Loading />
    )
  else if (authState === "success" && userInfoData.status >= 1)
    return (
      <div className="min-h-screen bg-black">
        <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
          <ConnectWallet
            onClose={() => router.push('/chat')}
            onConnect={handleConnect}
            // onDisclaimerClick={handleDisclaimerClick}
          />
        </div>
      </div>
    );

  return null
}