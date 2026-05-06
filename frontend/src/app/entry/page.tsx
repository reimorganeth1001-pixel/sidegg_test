'use client';
import CodeEntryModal from '@/components/CodeEntryModal';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthCtx } from '@/context/authContext';
import Loading from '@/components/Loading';

export default function EntryPage() {
  const router = useRouter();
  const { authState } = useContext(AuthCtx);

  useEffect(() => {
    if(authState == 'failure')
      router.push('/')
  }, [authState, router])


  if (authState === "pending")
    return (
      <Loading />
    )
  else if (authState === "success")
    return (
    <div className="min-h-screen bg-black">
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
        <CodeEntryModal />
      </div>
    </div>
    );

  return null
}