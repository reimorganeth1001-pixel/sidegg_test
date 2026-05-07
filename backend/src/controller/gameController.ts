import {
  NextFunction,
  Request,
  Response,
} from 'express';

import {
  espn,
  game,
  utils,
} from '@/feature';
import { espnConfig } from '@/config';

/**
 * Debug-style endpoint that forces an upstream refresh and returns the parsed ESPN dataset.
 *
 * This is useful for verifying ESPN connectivity and the event refresh pipeline.
 */
export const getGameEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await utils.getAndUpdateEvents();
    const testData = await espn.fetchNBAData();
    res.status(200).json({
      data: testData.data,
      status: 200
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
          error: error.message, // Send the error message
      });
    } else {
      res.status(500).json({
          error: 'An unknown error occurred', // Handle non-Error types
      });
    }
  }
}

/**
 * Returns the raw upstream ESPN payload without additional processing.
 * Useful when debugging parsing/mapping logic in the feature layer.
 */
export const getRawGameEvents = async (req: Request, res: Response, next: NextFunction) => { 
  try {
    const result = await espn.fetchRawNBAData();
    if(result.error) {
      throw new Error(result.error);
    }

    res.status(200).json({
      data: result.data,
      status: 200
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
          error: error.message, // Send the error message
      });
    } else {
      res.status(500).json({
          error: 'An unknown error occurred', // Handle non-Error types
      });
    }
  }
}


/**
 * Look up detailed metadata for a single game by id.
 *
 * Expects:
 * - `req.body.gameId`: string
 */
export const searchGameInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(!req.body?.gameId){
      throw new Error("gameId must be selected!")
    }
    const serachParam = req.body?.gameId

    const result = await espn.searchGameInfo(serachParam);
        
    if(result?.error){
      throw new Error(result?.error);
    }

    res.status(200).json({
      data: result.data,
      status: 200
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
          error: error.message, // Send the error message
      });
    } else {
      res.status(500).json({
          error: 'An unknown error occurred', // Handle non-Error types
      });
    }
  }
}

/**
 * Fetches the list of game actions (play-by-play style events) for a single game.
 *
 * Expects:
 * - `req.body.gameId`: string
 */
export const fetchGameActions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(!req.body?.gameId){
      throw new Error("gameId must be selected!")
    }
    const serachParam = req.body?.gameId

    const result = await game.fetchGameActions(serachParam);
        
    if(result?.error){
      throw new Error(result?.error);
    }

    res.status(200).json({
      data: result.data,
      status: 200
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
          error: error.message, // Send the error message
      });
    } else {
      res.status(500).json({
          error: 'An unknown error occurred', // Handle non-Error types
      });
    }
  }
}

/**
 * Returns a score snapshot for a given game and the requested team.
 *
 * Expects:
 * - `req.body.gameId`: string
 * - `req.body.teamName`: string
 */
export const fetchGameScore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(!req.body?.gameId){
      throw new Error("gameId must be selected!")
    }
    
    if(!req.body?.teamName){
      throw new Error("teamName must be selected!")
    }
    
    const result = await game.fetchGameScore(req.body.gameId, req.body.teamName);
        
    if(result?.error){
      throw new Error(result?.error);
    }

    res.status(200).json({
      data: result.data,
      status: 200
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
          error: error.message, // Send the error message
      });
    } else {
      res.status(500).json({
          error: 'An unknown error occurred', // Handle non-Error types
      });
    }
  }
}

/**
 * Returns the current period clock for a given game.
 *
 * Expects:
 * - `req.body.gameId`: string
 */
export const fetchPeriodClock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(!req.body?.gameId){
      throw new Error("gameId must be selected!")
    }
    
    const result = await game.fetchPeriodClock(req.body.gameId);
        
    if(result?.error){
      throw new Error(result?.error);
    }

    res.status(200).json({
      data: result.data,
      status: 200
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
          error: error.message, // Send the error message
      });
    } else {
      res.status(500).json({
          error: 'An unknown error occurred', // Handle non-Error types
      });
    }
  }
}

/**
 * Returns initial game details needed to bootstrap the UI (status-dependent).
 *
 * Expects:
 * - `req.body.status`: a status value compared against `espnConfig.GAME_STATUS`
 * - `req.body.selectedGameId` (optional depending on status)
 */
export const fetchGameInitialInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(req.body?.status !== espnConfig.GAME_STATUS && !req.body.selectedGameId){
      throw new Error("No Game Active Now!")
    }    
    
    const result = await game.fetchGameInitialInfo(req.body.status, req.body?.selectedGameId);
    
    if(result?.error){
      throw new Error(result?.error);
    }

    res.status(200).json({
      data: result.data,
      status: 200
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
          error: error.message, // Send the error message
      });
    } else {
      res.status(500).json({
          error: 'An unknown error occurred', // Handle non-Error types
      });
    }
  }
}