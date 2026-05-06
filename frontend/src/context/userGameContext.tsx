'use client'

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { gameType } from '@/type';
import { fetchUserGameInfo } from '@/utils/functions';
import { UserInfoCtx } from './userInfoContext';

import { toast } from 'react-toastify';
import { GameEventInfoCtx } from './gameEventInfoContext';

const defaultProvider: gameType.UserGameInfoContextType = {
    userGameInfo: {
        gameId: "", // Unique ESPN Game ID
        teamId: "",
        score: 0
    },
    setUserGameInfo: () => [],
    userGameError: "",
    setUserGameError: () => {},
};

const GameDataCtx = createContext<gameType.UserGameInfoContextType>(defaultProvider);

type Props = {
    children: ReactNode;
};

const GameDataProvider = ({ children }: Props) => {
    const [ userGameInfo, setUserGameInfo ] = useState<gameType.UserGameInfo>(defaultProvider.userGameInfo);
    const [ userGameError, setUserGameError ] = useState<string>("");
    const { gameEventInfo } = useContext(
        GameEventInfoCtx
    )

    const { userInfoData } = useContext(UserInfoCtx);  
    const init = async () => {

        if(!userInfoData.id) {
            return;
        }

        if(userInfoData.status < 2){
            return;
        }

        if(!gameEventInfo.gameId){
            return;
        }

        const userGame = await fetchUserGameInfo(userInfoData.id, gameEventInfo.gameId);
        if(userGame.error) {
            setUserGameError(userGame.error);
            toast.error(userGame.error,{
                style: {
                    background: "#111827",
                    color: "white",
                }
            })
        }
        setUserGameInfo({
            gameId: userGame.data?.data?.gameId,
            teamId: userGame.data?.data?.teamId,
            score: userGame.data?.data?.score
        });
    }
    useEffect(() => {
        init();
    }, [userInfoData, gameEventInfo]);

    return (
        <GameDataCtx.Provider value={{ userGameInfo, setUserGameInfo, userGameError, setUserGameError}}>
            {children}
        </GameDataCtx.Provider>
    )
}

export { GameDataCtx, GameDataProvider };