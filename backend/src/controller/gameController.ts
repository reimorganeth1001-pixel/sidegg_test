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