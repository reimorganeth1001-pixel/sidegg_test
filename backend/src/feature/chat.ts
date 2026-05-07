import prisma from '@/service/db';
import { chatType } from '@/types';

/**
 * Fetch all chat messages for a game, joined with user + team context.
 *
 * - Orders messages chronologically.
 * - Enriches each message with:
 *   - `userName`
 *   - `teamName`
 *   - `status` from `UserGame` for that game.
 */
export const handleFetchMessages = async (gameId: string): Promise<chatType.MessageResponseType> => {

    try {
        // Step 1: Find all chat records with the matching gameId
        const chatRecords = await prisma.chat.findMany({
            where: { gameId: gameId },
            orderBy: { created_at: "asc" },
            include: {
                users: { 
                    select: {
                        userName: true, // Fetch userName from User table
                        userGames: {
                            where: { gameId: gameId },
                            select: {
                                status: true,
                                teams: { select: { name: true } } // Fetch teamName from Team table
                            }
                        }
                    }
                }
            }
        });

        // Step 2: Transform each chat record to include user and team details
        const formattedMessages = chatRecords.map(chat => {
            const userGame = chat.users?.userGames?.[0]; // Get the first related userGame entry if exists
            return {
                id: chat.id,
                userId: chat.userId,
                userName: chat.users?.userName || "Unknown User",
                gameId: chat.gameId,
                teamName: userGame?.teams?.name || "Unknown Team",
                message: chat.message,
                status: userGame?.status || "N/A",
                created_at: chat.created_at
            };
        });

        return { message: formattedMessages };
    } catch (error) {
        return { 
            error: error instanceof Error ? error.message : "Unknown Error" 
        };
    }
};



/**
 * Persist a new chat message and return a fully-hydrated message record.
 *
 * - Inserts into `chat`.
 * - Looks up the associated `UserGame` to attach `userName`, `teamName`, and `status`.
 */
export const handleNewMessages = async (param: chatType.newMessageParam) => {
    try {
      // Create a new chat message
        const chat = await prisma.chat.create({
            data: {
            userId: param.userId,
            gameId: param.gameId,
            message: param.message,
            created_at: new Date()
            }
        });
    
        // Fetch additional user and team information from UserGame
        const userGame = await prisma.userGame.findFirst({
            where: {
            userId: param.userId,
            gameId: param.gameId
            },
            select: {
            status: true,
            teams: {
                select: { name: true }
            },
            users: {
                select: { userName: true }
            }
            }
        });
    
        const newChatRecord = {
            id: chat.id,
            userId: chat.userId,
            userName: userGame?.users?.userName || "Unknown User",
            gameId: chat.gameId,
            teamName: userGame?.teams?.name || "Unknown Team",
            message: chat.message,
            status: userGame?.status || "N/A",
            created_at: chat.created_at
        };
    
        return { message: newChatRecord };
        } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Unknown Error"
        };
    }
};
  

