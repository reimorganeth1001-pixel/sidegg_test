'use client';

import React, { useState, useEffect, PropsWithChildren } from "react";
import { io, Socket } from "socket.io-client";
import { websocket } from "@/config";

export interface SocketInterface {
  curSocket: Socket | null;
}

export const SocketContext = React.createContext<SocketInterface>({
  curSocket: null,
});

export const SocketContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [curSocket, setCurSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket: Socket = io(websocket.WEBSOCKET_URI);
    setCurSocket(socket);

    return () => {
      socket.disconnect(); // Ensure proper cleanup when the component unmounts
    };
  }, []);

  return (
    <SocketContext.Provider value={{ curSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
