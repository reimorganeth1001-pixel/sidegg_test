'use client'

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { gameType } from '@/type';
import { fetchUserGameData, updateUser } from '@/utils/functions';
import { UserInfoCtx } from './userInfoContext';

import { sideGG_back_Config } from '@/config'
import { toast } from 'react-toastify';

const defaultProvider: gameType.GameEventInfoContextType = {
    gameEventInfo: {
        gameId: '',
        fullName: '',
        shortName: '',
        city: '',
        state: '',
        logo: '',
        homeTeamId: '',
        awayTeamId: '',
        status: '',
        period: 0,
        startTime: '',
        lastUpdated: '',
    },
    setGameEventInfo: () => [],
    gameEventError: "",
    setGameEventError: () => {},
};

const GameEventInfoCtx = createContext<gameType.GameEventInfoContextType>(defaultProvider);

type Props = {
    children: ReactNode;
};

const GameEventInfoProvider = ({ children }: Props) => {
    const [ gameEventInfo, setGameEventInfo ] = useState<gameType.DetailedGame>(defaultProvider.gameEventInfo);
    const [ gameEventError, setGameEventError ] = useState<string>("");

    const { userInfoData } = useContext(UserInfoCtx);  
    const init = async () => {

        if(!userInfoData.id) {
            return;
        }

        const gameEventInfo = await fetchUserGameData(sideGG_back_Config.GAME_STATUS, userInfoData.selectedGameId);
        if(gameEventInfo.error) {
            setGameEventError(gameEventInfo.error);
            toast.error(gameEventInfo.error, {
                style: {
                  background: "#111827",
                  color: "white",
                }
            })
        }       
        
        if(gameEventInfo?.data?.data){
            const updateUserResult = await updateUser({
                userName: userInfoData.userName,
                emailAddr: userInfoData.emailAddr,
                phoneNumber: userInfoData.phoneNumber,
                twitterAccount: userInfoData.twitterAccount,
                updateData: userInfoData.userName,
                selectedGameId: gameEventInfo.data.data[0].gameId
            });

            if(updateUserResult.error){
                toast.error(updateUserResult.error);
            }
            setGameEventInfo(gameEventInfo.data.data[0]);
        }
    };

    useEffect(() => {
        init();
    }, [userInfoData]);

    return (
        <GameEventInfoCtx.Provider value={{ gameEventInfo, setGameEventInfo, gameEventError, setGameEventError}}>
            {children}
        </GameEventInfoCtx.Provider>
    )
}

export { GameEventInfoCtx, GameEventInfoProvider };