import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import { chatController } from '@/controller';
import { chatType } from '@/types';

export const socket_router = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, io:any) => {
    socket.on('fetchMessages', async (gameId: string) => {
        try {
            const result = await chatController.handleFetchMessages(gameId);
            socket.emit('chatHistory', result.message);
        } catch (error) {
            let error_str = error instanceof Error ? error.message : "Unknow Error";
            console.error("❌ Error fetching messages:", error_str);
        }
    });

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