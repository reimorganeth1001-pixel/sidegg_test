'use client'

import { createContext, ReactNode, useState } from "react"
import { userType } from "@/type"

const defaultProvider: userType.DetailedUserGameContextType = {
    userGameData: {},
    setUserGameData: () => []
};

const DetailedUserGameDataCtx = createContext<userType.DetailedUserGameContextType>(defaultProvider);

type Props = {
    children: ReactNode;
};

const DetailedUserGameDataProvider = ({ children }: Props) => {
    const [userGameData, setUserGameData] = useState<userType.DetailedUserGame>(defaultProvider.userGameData);

    return (
        <DetailedUserGameDataCtx.Provider value={{ userGameData, setUserGameData}}>
            {children}
        </DetailedUserGameDataCtx.Provider>
    )
}

export { DetailedUserGameDataProvider, DetailedUserGameDataCtx };