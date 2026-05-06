import {
  NextFunction,
  Request,
  Response,
} from 'express';

import { user } from '@/feature';
import { userType } from '@/types';
import { espnConfig } from '@/config';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(!req.body?.userInfo) {
        throw new Error("userInfo does not exist");
    }

    const userInfo: userType.UserInfo = {
        name: req.body.userInfo.name ? String(req.body.userInfo.name) : "User",
        email: req.body.userInfo.email ? String(req.body.userInfo.email) : undefined,
        phone: req.body.userInfo.phone ? String(req.body.userInfo.phone) : undefined,
        twitter: req.body.userInfo.twitter ? String(req.body.userInfo.twitter) : undefined,
    };
    const result = await user.createUser(userInfo)
    if(result.error) throw new Error(result.error);
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

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(!req.body?.userInfo.email) {
        throw new Error("userInfo email does not exist");
    }

    const updateData: string = req.body.updateData;
    const selectedGameId: string = req.body.selectedGameId;

    const userInfo: userType.UserInfo = {
        name: req.body.userInfo.name ? String(req.body.userInfo.name) : "User",
        email: req.body.userInfo.email ? String(req.body.userInfo.email) : undefined,
        phone: req.body.userInfo.phone ? String(req.body.userInfo.phone) : undefined,
        twitter: req.body.userInfo.twitter ? String(req.body.userInfo.twitter) : undefined,
    };
    const result = await user.updateUser(userInfo, updateData, selectedGameId)
    if(result.error) throw new Error(result.error);
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

export const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(!req.body?.userInfo) {
        throw new Error("userInfo does not exist");
    }

    const updateData: number = req.body.updateData;

    const userInfo: userType.UserInfo = {
        name: req.body.userInfo.name ? String(req.body.userInfo.name) : "User",
        email: req.body.userInfo.email ? String(req.body.userInfo.email) : undefined,
        phone: req.body.userInfo.phone ? String(req.body.userInfo.phone) : undefined,
        twitter: req.body.userInfo.twitter ? String(req.body.userInfo.twitter) : undefined,
    };
    const result = await user.updateUserStatus(userInfo, updateData)
    if(result.error) throw new Error(result.error);
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

export const playGame = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(!req.body?.playGameInfo.userId) {
        throw new Error("userId does not exist");
    }
    if(!req.body?.playGameInfo.gameId) {
        throw new Error("gameId does not exist");
    }
    if(!req.body?.playGameInfo.teamId) {
        throw new Error("teamId does not exist");
    }

    const playGameInfo: userType.playGameInfo = {
      userId: req.body.playGameInfo.userId ? String(req.body.playGameInfo.userId) : "User",
      gameId: req.body.playGameInfo.gameId ? String(req.body.playGameInfo.gameId) : "GameId",
      teamId: req.body.playGameInfo.teamId ? String(req.body.playGameInfo.teamId) : "TeamId",
    };
    const result = await user.playGame(playGameInfo);
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

export const getUserGameInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(!req.body?.userId) {
        throw new Error("UserId does not exist");
    }

    const result = await user.getUserGameInfo(req.body.userId, req.body.selectedGameId);
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

export const getUserGameEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(!req.body?.playGameInfo) {
        throw new Error("playGameInfo does not exist");
    }

    const playGameInfo: userType.playGameInfo = {
      userId: req.body.playGameInfo.userId ? String(req.body.playGameInfo.userId) : "User",
      gameId: req.body.playGameInfo.gameId ? String(req.body.playGameInfo.gameId) : "GameId",
      teamId: req.body.playGameInfo.teamId ? String(req.body.playGameInfo.teamId) : "TeamId",
    };
    const result = await user.getUserGameEvents(playGameInfo);
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

export const setUserGamePoints = async (req: Request, res: Response, next: NextFunction) => {

  try {
    if(!req.body?.UpdateUserGameInfo) {
        throw new Error("playGameInfo does not exist");
    }

    const UpdateUserGameInfo: userType.UpdateUserGameInfo = {
      userId: req.body.UpdateUserGameInfo.userId ? String(req.body.UpdateUserGameInfo.userId) : "User",
      gameId: req.body.UpdateUserGameInfo.gameId ? String(req.body.UpdateUserGameInfo.gameId) : "GameId",
      teamId: req.body.UpdateUserGameInfo.teamId ? String(req.body.UpdateUserGameInfo.teamId) : "TeamId",
      initialScore: req.body.UpdateUserGameInfo.initialScore ? Number(req.body.UpdateUserGameInfo.initialScore) : 0,
    };
    const result = await user.setUserGamePoints(UpdateUserGameInfo);
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

export const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(!req.body?.userId) {
        throw new Error("userId does not exist");
    }

    const result = await user.getUserInfo(req.body?.userId);
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

export const getUserGameDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(!req.body?.playGameInfo.userId) {
      throw new Error("userId does not exist");
    }

    if(!req.body?.playGameInfo.gameId) {
      throw new Error("gameId does not exist");
    }

    // if(!req.body?.playGameInfo.teamId) {
    //   throw new Error("teamId does not exist");
    // }

  const playGameInfo: userType.playGameInfo = {
    userId: req.body.playGameInfo.userId ? String(req.body.playGameInfo.userId) : "User",
    gameId: req.body.playGameInfo.gameId ? String(req.body.playGameInfo.gameId) : "GameId",
    teamId: req.body.playGameInfo.teamId ? String(req.body.playGameInfo.teamId) : "TeamId",
  };

    const result = await user.getUserGameDetails(playGameInfo);
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

export const getGetorLoassGamePointsAndSol = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(!req.body?.playGameInfo.userId) {
      throw new Error("userId does not exist");
    }

    if(!req.body?.playGameInfo.gameId) {
      throw new Error("gameId does not exist");
    }

    // if(!req.body?.playGameInfo.teamId) {
    //   throw new Error("teamId does not exist");
    // }

  const playGameInfo: userType.playGameInfo = {
    userId: req.body.playGameInfo.userId ? String(req.body.playGameInfo.userId) : "User",
    gameId: req.body.playGameInfo.gameId ? String(req.body.playGameInfo.gameId) : "GameId",
    teamId: req.body.playGameInfo.teamId ? String(req.body.playGameInfo.teamId) : "TeamId",
  };

    const result = await user.getGetorLoassGamePointsAndSol(playGameInfo);
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

