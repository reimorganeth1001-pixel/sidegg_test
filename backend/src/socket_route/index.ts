import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import { chatController } from '@/controller';
import { chatType } from '@/types';

/**
 * Register Socket.IO event handlers for a connected client.
 *
 * This is called for each new socket connection and wires up:
 * - inbound events from the client (e.g. "fetchMessages", "sendMessage")
 * - outbound events emitted back to the requesting socket or broadcast via `io`
 *
 * @param socket The connected client socket.
 * @param io The Socket.IO server instance used for broadcasting.
 */
export const socket_router = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, io:any) => {
    /**
     * Client requests the full chat history for a game.
     * Emits `chatHistory` back to the requesting socket.
     */
    socket.on('fetchMessages', async (gameId: string) => {
        try {
            const result = await chatController.handleFetchMessages(gameId);
            socket.emit('chatHistory', result.message);
        } catch (error) {
            let error_str = error instanceof Error ? error.message : "Unknow Error";
            console.error("❌ Error fetching messages:", error_str);
        }
    });

    /**
     * Client sends a new message.
     * Broadcasts `newMessage` to all connected clients via `io`.
     */
    socket.on('sendMessage', async (param : chatType.newMessageParam) => {
        try{            
            if(!param.userId || !param.gameId || param.message === ""){
                throw new Error("parameter is invalid");
            }
            const result = await chatController.handleNewMessages(param)
            io.emit('newMessage', result.message);
        } catch (error) {
            let error_str = error instanceof Error ? error.message : "Unknow Error";
            console.error("❌ Error new messages:", error_str);
        }
    });    
}