export type newMessageParam = {
    userId  : string,
    gameId: string,
    message: string
}

export type newMessageResponse = {
    id: string,
    userId: string,
    userName: string,
    gameId: string,
    teamName: string,
    message: string,
    status: string,
    created_at: string,
}

// export type MessageContextType = {
//     messageData: newMessageResponse[],
//     setMessageData: (value:newMessageResponse[]) => void
// }

export type MessageContextType = {
    messageData: newMessageResponse[];
    setMessageData: React.Dispatch<React.SetStateAction<newMessageResponse[]>>;
    messageError: string;
    setMessageError: React.Dispatch<React.SetStateAction<string>>;
};