import { Team } from './team';

export type Game = {
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
};

export type GameAction = {
    id: string; // Unique Event ID
    actionType: string;
    gameId: string;
    teamId: string;
    uid: string;
    description: string;
    clock: string;
    period: number;
    wallClock: string;
    scoreValue: number;
    homeScore: number;
    awayScore: number;
};

export type ActionType = {
    id: string;
    actionType: string;
    score: number;
    pointsValue: number;
    quantityValue: number;
    quantityValueSucc: number;
    createdAt: string;
    updatedAt: string;
};

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

export type gamePeriodClock = {
  period: number;
  clock: string;
}

export interface PeriodClockResponse{
  data?: gamePeriodClock;
  error?: string;
}

export interface UpdateGameResponse {
    error?: string;
    success?: boolean;
}

export interface ParseGameDataResponse {
  data:Game;
}

export interface ParseGameActionResponse {
  data: GameAction[];
}

export interface AnalyseGameResponse {
  games: Game[];
  teams: Team[];
  gameActions: GameAction[];
}

export interface gameActionsResponse{
  data: gameActions[],
  error?: string
}

export interface TeamScoreResponse{
  data: number,
  error?: string
}

export interface DetailedGameResponse{
  data?: DetailedGame[];
  error?: string;
}


