import { espnConfig } from '@/config';
import { espnServer } from '@/service/axios';
import prisma from '@/service/db';
import { espnType } from '@/types';

import { analyseGame } from './game';

/**
 * High-level ESPN integration entrypoint.
 *
 * - Calls the scoreboard API to get current events.
 * - For each event, calls the summary API and merges extra fields (period/status/startDate).
 * - Delegates to `analyseGame` to normalize into internal `games`, `teams`, and `gameActions`.
 */
export const fetchNBAData = async (): Promise<espnType.FetchNBADataResponse> => {
  try {
    const response = await espnServer.get(`/${espnConfig.ESPN_BASIC_URI}/${espnConfig.ESPN_SCOREBOARD_API}`);
    
    if(!response?.data?.events) {
      throw new Error("Score Board Api Error");
    }

    const games = response.data.events;
    const gameData = [];

    for (let game of games) {
      const gameId = game.id;
      const external = {
        period: 0,
        startDate: "",
        status: ""
      }
      external.period = game.status?.period;
      external.status = game.status?.type?.name;
      external.startDate = game.competitions[0]?.startDate;

      let details = await espnServer.get(`/${espnConfig.ESPN_BASIC_URI}/${espnConfig.ESPN_SUMMARY_API}${gameId}`);
      details.data = { ...details.data, ...external };
      gameData.push(details.data);
    }

    const data = analyseGame(gameData);

    return {
      data: {
        games: data.games,
        teams: data.teams,
        gameActions: data.gameActions
      }
    }
  } catch (error) {
    let err_str = "";
    if(error instanceof Error) {
      err_str = error.message;
    } else {
      err_str = "Unknown Error";
    }
    return {
      error: err_str
    }
  }
};

/**
 * Fetches the *raw* ESPN summary payloads for all games on the scoreboard.
 *
 * This is mainly useful for debugging mapping logic or when you need information
 * that is not yet modeled in the internal types.
 */
export const fetchRawNBAData = async (): Promise<espnType.FetchRawNBADataResponse> => {
  try {
    const response = await espnServer.get(`/${espnConfig.ESPN_BASIC_URI}/${espnConfig.ESPN_SCOREBOARD_API}`);
    
    if(!response?.data?.events) {
      throw new Error("Score Board Api Error");
    }

    const games = response.data.events;
    const gameData = [];

    for (let game of games) {
      const gameId = game.id;
      const details = await espnServer.get(`/${espnConfig.ESPN_BASIC_URI}/${espnConfig.ESPN_SUMMARY_API}${gameId}`);
      if(!details?.data) {
        throw new Error("Summary Event Api Error");
      }
      gameData.push(details.data);
    }

    return {
      data: gameData
    }
  } catch (error) {
    let err_str = "";
    if(error instanceof Error) {
      err_str = error.message;
    } else {
      err_str = "Unknown Error";
    }
    return {
      error: err_str
    }
  }
};

/**
 * Look up a single game + its teams by id from the local database.
 *
 * The timestamps are converted to ISO strings so the API surface is JSON-safe.
 */
export const searchGameInfo = async (
  gameId: string
): Promise<espnType.searchGameResponse> => {
  try {
    const game = await prisma.game.findUnique({
      where: { gameId },
      include: {
        teamA: true, // Include home team data
        teamB: true, // Include away team data
      }
    });

    if (!game) {
      throw new Error("Score Board Api Error");
    }

    const formattedGame = {
      ...game,
      startTime: game.startTime.toISOString(),
      lastUpdated: game.lastUpdated.toISOString(),
    };

    return { data: formattedGame };
  } catch (error) {
    let err_str = "";
    if (error instanceof Error) {
      err_str = error.message;
    } else {
      err_str = "Unknown Error";
    }
    return { error: err_str };
  }
};