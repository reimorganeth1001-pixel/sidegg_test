'use client';
import Login from '@/components/Login';

export default function Home() {

  return (
    <div className="min-h-screen bg-black">
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
        <Login />
      </div>
      
    </div>
  );
}