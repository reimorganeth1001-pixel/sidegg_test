import {
  Game,
  GameAction,
  DetailedGame,
} from './game';
import { Team } from './team';

export interface FetchNBADataResponse {
  error?: string;
  data?: {
    games: Game[];
    teams: Team[];
    gameActions: GameAction[];
  };
}

export interface FetchRawNBADataResponse {
  error?: string;
  data?: any[];
}

export interface searchGameResponse{
  error?: string,
  data?: DetailedGame,
}