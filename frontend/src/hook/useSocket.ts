'use client'

import { useContext } from "react";
import { SocketContext } from "@/context/socketContext";

const useSocket = () => {
  const { curSocket } = useContext(SocketContext);
  return curSocket;
};

export default useSocket;