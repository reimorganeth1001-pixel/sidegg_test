import {
  NextFunction,
  Request,
  Response,
} from 'express';

import { code } from '@/feature';

export const searchCodeAndUpdateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(!req.body?.code) {
      throw new Error("code does not exist");
    }

    const verifyCodeStatus = await code.searchCodeAndUpdateStatus(
      req?.body?.code
    );

    if(!verifyCodeStatus.success){
      throw new Error(verifyCodeStatus.error);
    }

    res.status(200).json({
      data: verifyCodeStatus.data,
      error:""
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