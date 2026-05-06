import { Team } from "./team";

export type UserGameInfo = {
    gameId: string; // Unique ESPN Game ID
    teamId: string;
    score: number;
};

export interface UserGameInfoResponse{
    data?: UserGameInfo,
    error?: string
}

export type DetailedGame = {
    gameId: string; // Unique ESPN Game ID
    fullName: string;
    shortName: string;
    city: string;
    state: string;
    logo: string;
    homeTeamId: string;
    awayTeamId: string;
    status: string;
    period: number;
    startTime: string;
    lastUpdated: string;
    teamA?: Team; // Home team details
    teamB?: Team; // Away team details
};

export interface GameInfoResponse{
    data?: DetailedGame,
    error?: string
}

export type gameActions = {
    id: string,
    action: string,
    points: number,
    side: string,
    time: {
        displayValue: string,
        period: number
    }
}

export interface gameActionsResponse{
    data?: gameActions[],
    error?: string
}

export type gameActionContextType = {
    gameActionData: gameActions[]
    setGameActionData: React.Dispatch<React.SetStateAction<gameActions[]>>;
}


export type UserGameInfoContextType = {
    userGameInfo: UserGameInfo
    setUserGameInfo: React.Dispatch<React.SetStateAction<UserGameInfo>>;
    userGameError: string;
    setUserGameError: React.Dispatch<React.SetStateAction<string>>;
}

export type GameEventInfoContextType = {
    gameEventInfo: DetailedGame
    setGameEventInfo: React.Dispatch<React.SetStateAction<DetailedGame>>;
    gameEventError: string;
    setGameEventError: React.Dispatch<React.SetStateAction<string>>;
}