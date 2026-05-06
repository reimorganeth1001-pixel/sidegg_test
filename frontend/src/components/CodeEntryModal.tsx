'use client';
import 'react-toastify/dist/ReactToastify.css';

import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { sideGG_back_Config } from '@/config';
import { UserInfoCtx } from '@/context/userInfoContext';
import { updateUserStatus } from '@/utils/functions';

const CodeEntryModal = () => {
  const { userInfoData, setUserInfoData } = useContext(UserInfoCtx);
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);

  // ✅ Correct `useRef` initialization
  const inputRefs = useRef<(HTMLInputElement | null)[]>(new Array(6).fill(null));

  useEffect(() => {
    if (!userInfoData) return;

    if (userInfoData.status >= 1) {
      router.push('/connect');
    }
  }, [userInfoData, router]);

  const handleChange = (index: number, value: string) => {
    if (value === '') {
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);
      return;
    }

    // Only accept a single digit (0-9)
    if (/^[0-9]$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Automatically focus the next input if available.
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' && code.every(digit => digit !== '')) {
      handleSubmit();
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      const newCode = [...code];

      // If current input is not empty, clear it.
      if (newCode[index] !== '') {
        newCode[index] = '';
        setCode(newCode);
      } else if (index > 0) {
        // Move to previous input and clear it.
        inputRefs.current[index - 1]?.focus();
        newCode[index - 1] = '';
        setCode(newCode);
      }
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join('');
    if (fullCode.length === 6) {
      try {
        const response = await axios.post(
          `${sideGG_back_Config.SIDEGG_SERVER}/${sideGG_back_Config.FETCH_CODESTATUS_API}`,
          { code: fullCode }, // Payload
          { headers: { "Content-Type": "application/json" } } // Headers
        );

        console.log(response.data);
  
        await updateUserStatus({
          userName: userInfoData.userName,
          emailAddr: userInfoData.emailAddr,
          phoneNumber: userInfoData.phoneNumber,
          twitterAccount: userInfoData.twitterAccount,
          updateData: 1,
        });
  
        setUserInfoData({ ...userInfoData, status: 1 });
        router.push('/connect');
      } catch (error) {
        if (!toast.isActive("error-toast")) { // ✅ Prevent duplicate toast
          const errorMessage =
            axios.isAxiosError(error) && error.response?.data?.error
              ? error.response.data.error
              : error instanceof Error
              ? error.message
              : "An unexpected error occurred";
  
          toast.error(errorMessage, {
            toastId: "error-toast", // ✅ Unique toast ID to prevent duplicates
            style: {
              background: "#111827",
              color: "white",
            },
          });
        }
      }
    }
  };
  

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
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

      <h2 className="text-xl text-gray-300 text-center mb-6">Enter your 6-digit code</h2>

      <form onSubmit={onFormSubmit}>
        <div className="flex gap-2 mb-6 justify-center">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }} // ✅ Fix here
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              className="w-12 h-12 text-center bg-gray-800 border border-gray-700 
                       rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                       text-gray-100 placeholder-gray-500"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={!code.every(digit => digit !== '')}
          className="w-full bg-gradient-to-r from-indigo-600 to-emerald-600 
                   text-white py-2 px-4 rounded-lg hover:from-indigo-700 
                   hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed 
                   flex items-center justify-center transform hover:scale-[1.02] 
                   transition-all duration-200 font-medium"
        >
          Enter Event
        </button>
      </form>
    </div>
  );
};

export default CodeEntryModal;
