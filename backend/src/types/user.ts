import { gameType } from ".";

export interface createUserResponse {
    error?: string;
    data?: userRecored;
}

export interface playGameResponse {
    error?: string;
    data?: userGameType
}

export interface UserGameInfoResponse {
    error?: string;
    data?: userGameInfo
}

export interface UpdateUserGameScoreResponse {
    data?: UpdatedResponseType;
    error?: string
}

export type UpdatedResponseType = {
    userId: string;
    score: number;
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
}

export interface userGameActionsResponse {
    error?: string;
    data?: userGameActionType[];
}

export interface userScoreResponse {
    error?: string;
    data?: userScore;
}

export type userGameInfo = {
    gameId: string,
    teamId: string,
    score: number
}

export type userRecored = {
    id: string;
    userName: string;
    emailAddr: string | null;
    twitterAccount: string | null;
    phoneNumber: string | null;
    score: number;
    status: number;
    selectedGameId: string | null;
}

export type UserInfo = {
    name: string;
    email: string | undefined;
    phone: string | undefined;
    twitter: string | undefined;
}

export type userGameType = {
    score: number;
    teamId: string;
    gameId: string;
    userId: string;
    status: string;
};

export type userGameActionType = {
    score: number;
    userId: string;
    gameId: string;
    gameActionId: string;
}


export type playGameInfo = {
    userId: string;
    gameId: string;
    teamId: string;
}

export type getLoassGamePointsAndSolResponse = {
    data?: getLoassGamePointsAndSolResponseData;
    error?: string;
}

export type getLoassGamePointsAndSolResponseData = {
    score: number;
    sol: number;
    startScore: number;
    startSol: number;
}


export interface DetailedUserGame{
    userScore?: userScore;
    gameScore?: gameType.TeamScoreResponse;
    periodClock?: gameType.PeriodClockResponse;
    gameActions?: gameType.gameActionsResponse;
    teamScores?: { teamName: string; totalScore: number }[];
}

export interface DetailedUserGameResponse{
    data?: DetailedUserGame;
    error?: string
}