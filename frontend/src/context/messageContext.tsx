'use client'

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { sideGG_back_Config } from '@/config';
import { chatType } from '@/type';
import {
  fetchMessages,
} from '@/utils/functions';
import { decodeToken } from '@/utils/jwt';
import { GameEventInfoCtx } from './gameEventInfoContext';

const defaultProvider: chatType.MessageContextType = {
  messageData: [],
  setMessageData: () => {},
  messageError: "",
  setMessageError: () => {}
};

const MessageCtx = createContext<chatType.MessageContextType>(defaultProvider);

type Props = {
  children: ReactNode;
};

const MessageProvider = ({ children }: Props) => {
  const [messageData, setMessageData] = useState<chatType.newMessageResponse[]>(defaultProvider.messageData);
  const [messageError, setMessageError] = useState<string>("");
  const { gameEventInfo } = useContext(
    GameEventInfoCtx
)

  const initMessageData = async (): Promise<void> => {
    const storedToken = localStorage.getItem(sideGG_back_Config.SIDE_GG_TOEKN);
    if(storedToken){
      const decodedUserId = decodeToken(storedToken);
      if(decodedUserId?.userId){

        if(!gameEventInfo.gameId) {
          return;
        }

        if(gameEventInfo?.gameId !== '') {
          const messagesFromDatabase = await fetchMessages(gameEventInfo?.gameId);
          if(messagesFromDatabase.error) {
            setMessageError(messagesFromDatabase.error);
            return;
          }
          setMessageData(messagesFromDatabase.data.data);
        }
      }
    }
  };
  
  useEffect(() => {
    initMessageData();
  }, [gameEventInfo])

  return (
    <MessageCtx.Provider value={{ messageData, setMessageData, messageError, setMessageError }}>
      {children}
    </MessageCtx.Provider>
  );
};

export { MessageCtx, MessageProvider };
