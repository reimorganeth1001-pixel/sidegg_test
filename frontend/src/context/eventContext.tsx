'use client'

import { createContext, ReactNode, useState } from "react"
import { gameType } from "@/type"

const defaultProvider: gameType.gameActionContextType = {
    gameActionData: [],
    setGameActionData: () => []
};

const GameActionCtx = createContext<gameType.gameActionContextType>(defaultProvider);

type Props = {
    children: ReactNode;
};

const GameActionProvider = ({ children }: Props) => {
    const [gameActionData, setGameActionData] = useState<gameType.gameActions[]>(defaultProvider.gameActionData);

    return (
        <GameActionCtx.Provider value={{ gameActionData, setGameActionData}}>
            {children}
        </GameActionCtx.Provider>
    )
}

export { GameActionProvider, GameActionCtx };