'use client'

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { sideGG_back_Config } from '@/config';
import { userType } from '@/type';
import { fetchUserInfo } from '@/utils/functions';
import { decodeToken } from '@/utils/jwt';
import { AuthCtx } from './authContext';

const defaultProvider: userType.userInfoContextType = {
    userInfoData: {
        id: "",
        userName: "",
        emailAddr: "",
        phoneNumber: "",
        twitterAccount: "",
        score: 0,
        status: 0,
        selectedGameId: "",
        userPicture: ""
    },
    setUserInfoData: () => {},
    userInfoError: "",
    setUserInfoError: () => {}
}

const UserInfoCtx = createContext<userType.userInfoContextType>(defaultProvider);

type Props = {
    children: ReactNode;
};

const UserInfoProvider = ({ children }: Props) => {
    const [userInfoData, setUserInfoData] = useState<userType.userInfo>(defaultProvider.userInfoData);
    const [userInfoError, setUserInfoError] = useState<string>("");
    const { setAuthState } = useContext(AuthCtx);

    useEffect(() => {
        const initUser = async (): Promise<void> => {
            setAuthState("pending");
            const storedToken = localStorage.getItem(sideGG_back_Config.SIDE_GG_TOEKN);
            if(storedToken) {
                const decodedUserId = decodeToken(storedToken);
                if(decodedUserId){
                    const response = await fetchUserInfo(decodedUserId.userId)

                    if(response.error) {
                        setUserInfoError(response.error);
                        setAuthState("failure");
                    }

                    if(response.data){
                        setUserInfoData(response.data.data);
                        setAuthState("success");
                    }
                } 
            } else {
                setAuthState("failure");
            }
            // else{
            //     router.push("/");
            // }
        };
        initUser()
    },[])

    return (
        <UserInfoCtx.Provider value={{ userInfoData, setUserInfoData, userInfoError, setUserInfoError}}>
            {children}
        </UserInfoCtx.Provider>
    )
}

export { UserInfoCtx, UserInfoProvider };