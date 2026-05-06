'use client';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-toastify';

const Login = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const handleXLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`, // Set your callback URL here
      },
    });
    
    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-gray-900 rounded-xl shadow-2xl border border-indigo-500/20">
      <div className="flex justify-center mb-4">
        <img 
          src="/new_sidesgg.svg"
          // src="/Original Logo_Indigo_No_BG.svg"
          alt="sides.gg"
          className="h-12 w-auto"
        />
      </div>

      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-xl text-gray-300 mb-2">
            Welcome to sides.gg
          </h2>
          <p className="text-sm text-gray-400">
            Login with X to enter your invite code
          </p>
        </div>
        
        <button
          onClick={handleXLogin}
          className="w-full bg-gradient-to-r from-indigo-600 to-emerald-600 
                   text-white py-3 px-4 rounded-lg hover:from-indigo-700 
                   hover:to-emerald-700 transform hover:scale-[1.02] 
                   transition-all duration-200 font-medium"
        >
          Login with X
        </button>

        <p className="text-xs text-gray-400 text-center">
          You will be directed to X to authorize the login
        </p>
      </div>
    </div>
  );
}

export default Login;