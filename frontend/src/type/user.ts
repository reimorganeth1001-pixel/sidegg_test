export interface UpdateUserParam{
    userName: string,
    emailAddr: string,
    phoneNumber: string,
    twitterAccount: string,
    updateData: string,
    selectedGameId: string, // This field is just for game test on 1th of March!
}

export interface UpdateUserStatusParam{
    userName: string,
    emailAddr: string,
    phoneNumber: string,
    twitterAccount: string,
    updateData: number,
}

export type playGameInfo = {
    userId: string;
    gameId: string;
    teamId: string;
}

export type userInfo = {
    id: string,
    userName: string,
    emailAddr: string,
    phoneNumber: string,
    twitterAccount: string,
    score: number,
    status: number,
    selectedGameId: string,
    userPicture: string,
}

export interface userInfoContextType{
    userInfoData: userInfo
    setUserInfoData: React.Dispatch<React.SetStateAction<userInfo>>;
    userInfoError: string,
    setUserInfoError: React.Dispatch<React.SetStateAction<string>>;
}

export type UpdateUserGameInfo = {
    userId: string;
    gameId: string,
    teamId: string,
    initialScore: number;
}


export type userScore ={
    userId: string;
    score: number;
    status: string;
}


export interface TeamScoreResponse{
    data: number,
    error?: string
}


export type gameActions = {
    id: string,
    action: string,
    points: number,
    side: string,
    teamId: string,    
    time: {
        displayValue: string,
        period: number
    }
}

export interface gameActionsResponse{
    data?: gameActions[],
    error?: string
}

export type gamePeriodClock = {
    period: number;
    clock: string;
}

export interface PeriodClockResponse{
    data?: gamePeriodClock;
    error?: string;
}


export interface DetailedUserGameResponse{
    data?: DetailedUserGame;
    error?: string
}

export interface DetailedUserGame{
    userScore?: userScore;
    gameScore?: TeamScoreResponse;
    periodClock?: PeriodClockResponse;
    gameActions?: gameActionsResponse;
    teamScores?: { 
        teamName: string; 
        totalScore: number;
        teamId: string;
    }[];
}

export type DetailedUserGameContextType = {
    userGameData: DetailedUserGame
    setUserGameData: React.Dispatch<React.SetStateAction<DetailedUserGame>>;
}