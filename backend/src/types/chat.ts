export interface newMessageParam{
    userId: string,
    gameId: string,
    message: string
}

export type MessageType = {
    id: string,
    userId: string,
    userName: string,
    gameId: string,
    teamName: string,
    message: string,
    status: string,
    created_at: Date,
}

export interface MessageResponseType {
    message?: MessageType[],
    error?: string
}

export interface newMessageResponseType {
    message?: MessageType,
    error?: string
}