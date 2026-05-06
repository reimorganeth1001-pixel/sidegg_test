import axios from 'axios';

import { sideGG_back_Config } from '@/config';
import { userType } from '@/type';
import { UpdateUserParam } from '@/type/user';
import { erroHndling } from './help';

export const getGameInfo = async (gameId : string) => {
    try{
        const game = await axios.post(
            `${sideGG_back_Config.SIDEGG_SERVER}/${sideGG_back_Config.GET_GAME_INFO}`, 
            { gameId: gameId }, // Payload
            { headers: { "Content-Type": "application/json" } } // Headers
        );
        return {
            data: game.data 
        };
    } catch (error) {
        return {
            error: erroHndling(error)
        }
    }
}


export const updateUser = async (param : UpdateUserParam) => {
    try{
        const response = await axios.post(
            `${sideGG_back_Config.SIDEGG_SERVER}/${sideGG_back_Config.UPDATE_USERNAME}`, 
            { 
                userInfo: {
                    name: param.userName,
                    email: param.emailAddr,
                    phone: param.phoneNumber,
                    twitter: param.twitterAccount,                
                },
                updateData: param.updateData,
                selectedGameId: param.selectedGameId,
            }, // Payload
            { headers: { "Content-Type": "application/json" } } // Headers
        )

        const newUserName = response.data.data.userName;

        // const storedUser = localStorage.getItem("User");
        // const user = storedUser ? JSON.parse(storedUser) : {};
        
        // const newUser = { ...user, userName: newUserName };

        // // Remove the existing "User" key
        // localStorage.removeItem("User");

        // // Create a new user object (newUser should already be defined)
        // localStorage.setItem("User", JSON.stringify(newUser));

        return{
            newUserName: newUserName
        }
        
    } catch (error) {
        return {
            error: erroHndling(error)
        }
    }
}

export const updateUserStatus = async (param : userType.UpdateUserStatusParam) => {
    try{
        const response = await axios.post(
            `${sideGG_back_Config.SIDEGG_SERVER}/${sideGG_back_Config.UPDATE_USER_STATUS}`, 
            { 
                userInfo: {
                    name: param.userName,
                    email: param.emailAddr,
                    phone: param.phoneNumber,
                    twitter: param.twitterAccount,                
                },
                updateData: param.updateData,
            }, // Payload
            { headers: { "Content-Type": "application/json" } } // Headers
        )

        return{
            newUser: response.data.data
        }
        
    } catch (error) {
        return {
            error: erroHndling(error)
        }
    }
}

export const playGame = async (param: userType.playGameInfo) => {
    try{
        const result = await axios.post(
            `${sideGG_back_Config.SIDEGG_SERVER}/${sideGG_back_Config.PLAYGAME}`, 
            { 
                playGameInfo: {
                    userId: param.userId,
                    gameId: param.gameId,
                    teamId: param.teamId,
                },
            }, // Payload
            { headers: { "Content-Type": "application/json" } } // Headers
        )

        return{
            data: result.data
        }
    } catch (error) {
        return {
            error: erroHndling(error)
        }
    }
}

export const fetchGameActions = async (gameId: string) => {
    try{
        const result = await axios.post(
            `${sideGG_back_Config.SIDEGG_SERVER}/${sideGG_back_Config.FETCH_GAME_ACTIONS}`, 
            { 
                gameId: gameId
            }, // Payload
            { headers: { "Content-Type": "application/json" } } // Headers
        )

        return{
            data: result.data
        }
    } catch (error) {
        return {
            error: erroHndling(error)
        }
    }
}


export const fetchUserInfo = async (userId: string) => {
    try{
        const result = await axios.post(
            `${sideGG_back_Config.SIDEGG_SERVER}/${sideGG_back_Config.FETCH_USER_INFO}`, 
            { 
                userId: userId
            }, // Payload
            { headers: { "Content-Type": "application/json" } } // Headers
        )

        return{
            data: result.data
        }
    } catch (error) {
        return {
            error: erroHndling(error)
        }
    }
}

export const fetchMessages = async (gameId: string) => {
    try{
        const result = await axios.post(
            `${sideGG_back_Config.SIDEGG_SERVER}/${sideGG_back_Config.FETCH_MESSAGES}`, 
            { 
                gameId: gameId
            }, // Payload
            { headers: { "Content-Type": "application/json" } } // Headers
        )

        return{
            data: result.data
        }
    } catch (error) {
        return {
            error: erroHndling(error)
        }
    }
}

export const fetchUserGameInfo = async (userId: string, selectedGameId: string) => {
    try{
        const result = await axios.post(
            `${sideGG_back_Config.SIDEGG_SERVER}/${sideGG_back_Config.FETCH_USER_GAME_INFO}`, 
            { 
                userId: userId,
                selectedGameId: selectedGameId
            }, // Payload
            { headers: { "Content-Type": "application/json" } } // Headers
        )

        return{
            data: result.data
        }
    } catch (error) {
        return {
            error: erroHndling(error)
        }
    }
}

export const fetchTeamScoreInGame = async (gameId: string, teamName: string) => {
    try{
        const result = await axios.post(
            `${sideGG_back_Config.SIDEGG_SERVER}/${sideGG_back_Config.FETCH_TEAM_SCORE}`, 
            { 
                gameId: gameId,
                teamName: teamName
            }, // Payload
            { headers: { "Content-Type": "application/json" } } // Headers
        )

        return{
            data: result.data
        }
    } catch (error) {
        return {
            error: erroHndling(error)
        }
    }
}

export const fetchPeriodClock = async (gameId: string) => {
    try{
        const result = await axios.post(
            `${sideGG_back_Config.SIDEGG_SERVER}/${sideGG_back_Config.FETCH_PERIOD_CLOCK}`, 
            { 
                gameId: gameId,
            }, // Payload
            { headers: { "Content-Type": "application/json" } } // Headers
        )

        return{
            data: result.data
        }
    } catch (error) {
        return {
            error: erroHndling(error)
        }
    }
}

export const fetchUserGameData = async (status: string, selectedGameId: string) => {
    try{
        const result = await axios.post(
            `${sideGG_back_Config.SIDEGG_SERVER}/${sideGG_back_Config.FETCH_GAME_INITIAL_DATA}`, 
            { 
                status: status,
                selectedGameId: selectedGameId,
            }, // Payload
            { headers: { "Content-Type": "application/json" } } // Headers
        )

        return{
            data: result.data
        }
    } catch (error) {
        return {
            error: erroHndling(error)
        }
    }
}

export const fetchUserGameScore = async (playGameInfo: userType.playGameInfo) => {
    try{
        const result = await axios.post(
            `${sideGG_back_Config.SIDEGG_SERVER}/${sideGG_back_Config.USRE_GAME_SCORE}`, 
            { 
                playGameInfo: {
                    userId: playGameInfo.userId,
                    gameId: playGameInfo.gameId,
                    teamId: playGameInfo.teamId
                },
            }, // Payload
            { headers: { "Content-Type": "application/json" } } // Headers
        )

        return{
            data: result.data
        }
    } catch (error) {
        return {
            error: erroHndling(error)
        }
    }
}

export const setUserGamePoints = async (UpdateUserGameInfo: userType.UpdateUserGameInfo) => {
    try{
        const result = await axios.post(
            `${sideGG_back_Config.SIDEGG_SERVER}/${sideGG_back_Config.SET_USRE_GAME_SCORE}`, 
            { 
                UpdateUserGameInfo: {
                    userId: UpdateUserGameInfo.userId,
                    gameId: UpdateUserGameInfo.gameId,
                    teamId: UpdateUserGameInfo.teamId,
                    initialScore: UpdateUserGameInfo.initialScore,
                },
            }, // Payload
            { headers: { "Content-Type": "application/json" } } // Headers
        )

        return{
            data: result.data
        }
    } catch (error) {
        return {
            error: erroHndling(error)
        }
    }
}

export const getUserGameDetails = async (playGameInfo: userType.playGameInfo) => {
    try{
        const result = await axios.post(
            `${sideGG_back_Config.SIDEGG_SERVER}/${sideGG_back_Config.GET_USRE_GAME_DETAIL}`, 
            {
                playGameInfo: {
                    userId: playGameInfo.userId,
                    gameId: playGameInfo.gameId,
                    teamId: playGameInfo.teamId,
                },
            }, // Payload
            { headers: { "Content-Type": "application/json" } } // Headers
        )

        return{
            data: result.data
        }
    } catch (error) {
        return {
            error: erroHndling(error)
        }
    }
}

export const getUserGameGetOrLoassScore = async (playGameInfo: userType.playGameInfo) => {
    try{
        const result = await axios.post(
            `${sideGG_back_Config.SIDEGG_SERVER}/${sideGG_back_Config.GET_USRE_GAME_GET_OR_LOASS_SCORE}`, 
            {
                playGameInfo: {
                    userId: playGameInfo.userId,
                    gameId: playGameInfo.gameId,
                    teamId: playGameInfo.teamId,
                },
            }, // Payload
            { headers: { "Content-Type": "application/json" } } // Headers
        )

        return{
            data: result.data
        }
    } catch (error) {
        return {
            error: erroHndling(error)
        }
    }
}




