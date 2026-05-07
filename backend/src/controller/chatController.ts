import {
  NextFunction,
  Request,
  Response,
} from 'express';

import { chat } from '@/feature';
import { chatType } from '@/types';

/**
 * Internal helper used by non-HTTP call sites (e.g. socket handlers).
 *
 * @param param The game id to fetch messages for.
 * @returns An object with either `message` (success) or `error` (failure).
 */
export const handleFetchMessages = async (param: string) => {
    try {
        const result = await chat.handleFetchMessages(param);

        return {
            message: result.message
        }        
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Unknown Error"
        }
    }
    
}

/**
 * REST endpoint handler for retrieving chat messages for a given game.
 *
 * Expects:
 * - `req.body.gameId`: string
 *
 * Responds:
 * - 200: `{ data: <messages>, status: 200 }`
 * - 500: `{ error: <message> }`
 */
export const fetchMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(!req.body.gameId){
            throw new Error("gameId doesnt exits");
        }
        const result = await chat.handleFetchMessages(req.body.gameId);

        res.status(200).json({
            data: result.message,
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
 * Internal helper used by non-HTTP call sites (typically Socket.IO).
 *
 * Validates required fields and forwards the request to the feature layer.
 *
 * @param param New message payload (userId/gameId/message).
 * @returns An object with either `message` (success) or `error` (failure).
 */
export const handleNewMessages = async (param: chatType.newMessageParam) => {
    try {
        if(!param.userId){
            throw new Error("userId is invalid");
        }
        if(!param.gameId){
            throw new Error("gameId is invalid");
        }
        if(param.message === ""){
            throw new Error("message is invalid");
        }
        const result = await chat.handleNewMessages(param);
        return {
            message: result.message
        }        
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Unknown Error"
        }
    }
    
}