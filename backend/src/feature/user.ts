import { espnConfig } from '@/config';
import prisma from '@/service/db';
import {
  gameType,
  userType,
} from '@/types';
import { Prisma } from '@prisma/client';

export const createUser = async(userInfo: userType.UserInfo): Promise<userType.createUserResponse> => {
    const userData = {
        userName: userInfo.name,
        emailAddr: userInfo.email || undefined, // Only include if exists
        twitterAccount: userInfo.twitter || undefined,
        phoneNumber: userInfo.phone || undefined,
        created_at: new Date(),
    };
    
    const filteredUserData: Prisma.UserCreateInput = {
        userName: userData.userName,
        created_at: userData.created_at,
        ...(userData.emailAddr && { emailAddr: userData.emailAddr }),
        ...(userData.twitterAccount && { twitterAccount: userData.twitterAccount }),
        ...(userData.phoneNumber && { phoneNumber: userData.phoneNumber }),
    };

    
    try {
        const existUser = await prisma.user.findFirst({
            where: {
                OR: [
                { emailAddr: userData.emailAddr || undefined },
                { twitterAccount: userData.twitterAccount || undefined },
                { phoneNumber: userData.phoneNumber || undefined }
                ]
            },
            select: {
                id: true,
                userName: true,
                emailAddr: true,
                phoneNumber: true,
                twitterAccount: true,
                score: true,
                status: true,
                selectedGameId: true,
            }
        });

        if (existUser) {
            return {
                data: existUser
            }
        }

        const user = await prisma.user.create({
            data: filteredUserData,
            select: {
                id: true,
                userName: true,
                emailAddr: true,
                phoneNumber: true,
                twitterAccount: true,
                score: true,
                status: true,
                selectedGameId: true,
            }
        })
        return {
            data: user
        }
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Create User Error"
        }
    }
}

export const getUserInfo = async(userId: string): Promise<userType.createUserResponse> => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: userId
            },
            select: {
                id: true,
                userName: true,
                emailAddr: true,
                phoneNumber: true,
                twitterAccount: true,
                score: true,
                status: true,
                selectedGameId: true,
            }
        });

        if(!user){
            throw new Error("User is not registered!")
        }

        return {
            data: user
        }
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "User Info Unknown Error"
        }
    }
}

export const updateUser = async(userInfo: userType.UserInfo, updateData: string, selectedGameId:string): Promise<userType.createUserResponse> => {
    const userData = {
        userName: userInfo.name,
        emailAddr: userInfo.email || undefined, // Only include if exists
        twitterAccount: userInfo.twitter || undefined,
        phoneNumber: userInfo.phone || undefined,
    };

    try {
        const existUser = await prisma.user.findFirst({
            where: {
                userName: updateData,
                selectedGameId: selectedGameId
            }
        })

        if(existUser) {
            return {
                data: existUser
            }
        }
        const user = await prisma.user.update({
            where: {
                emailAddr: userData.emailAddr, // assuming email is unique and defined
            },
            data: {
                userName: updateData,
                selectedGameId: selectedGameId,
                updated_at: new Date()
            },
            select: {
                id: true,
                userName: true,
                emailAddr: true,
                phoneNumber: true,
                twitterAccount: true,
                score: true,
                status: true,
                selectedGameId: true,
            },
        });

        if(!user){
            throw new Error("User is not registered!")
        }
        return { data: user };
    } catch (error) {
        return{
            error: error instanceof Error ? error.message : "User Updated Unknown Error"
        }
    }
}

export const updateUserStatus = async(userInfo: userType.UserInfo, status: number): Promise<userType.createUserResponse> => {
    const userData = {
        userName: userInfo.name,
        emailAddr: userInfo.email || undefined, // Only include if exists
        twitterAccount: userInfo.twitter || undefined,
        phoneNumber: userInfo.phone || undefined,
    };

    try {
        const user = await prisma.user.update({
            where: {
                emailAddr: userData.emailAddr, // assuming email is unique and defined
            },
            data: {
                status: status,
                updated_at: new Date()
            },
            select: {
                id: true,
                userName: true,
                emailAddr: true,
                phoneNumber: true,
                twitterAccount: true,
                score: true,
                status: true,
                selectedGameId: true,
            },
        });

        if(!user){
            throw new Error("User is not registered!")
        }
        return { data: user };
    } catch (error) {
        return { 
            error: error instanceof Error ? error.message : "User Updated Unknown Error"
        };
    }
}

export const playGame = async(playInfo: userType.playGameInfo): Promise<userType.playGameResponse> => {
    try {        
        const playGameInfo: userType.playGameInfo = {
            userId: playInfo.userId,
            gameId: playInfo.gameId,
            teamId: playInfo.teamId
        };

        if(!playGameInfo.userId || playGameInfo.userId == "") {
            throw new Error("UserId doesnt exist");
        }

        if(!playGameInfo.gameId || playGameInfo.gameId == "") {
            throw new Error("gameId doesnt exist");
        }
    
        const userInfo = await prisma.user.findUnique({
            where: { id: playGameInfo.userId },
        })

        if(!userInfo) throw new Error("User doesn't exist");

        let userGame = await prisma.userGame.findUnique({
            where: {
                userId_gameId: {
                    userId: playInfo.userId,
                    gameId: playInfo.gameId
                }
            },
            select: {
                userId: true,
                gameId: true,
                teamId: true,
                status: true,
                score: true,
                startScore: true
            }
        })

        if(userGame) {
            return {
                data: userGame
            }
        }
   
        userGame = await prisma.userGame.create({
            data: {
                userId: playInfo.userId,
                gameId: playInfo.gameId,
                teamId: playInfo.teamId,
                status: "true",
                created_at: new Date()
            },
            select: {
                userId: true,
                gameId: true,
                teamId: true,
                status: true,
                score: true,
                startScore: true
            }
        })
        return {
            data: userGame
        }
    } catch (error) {
       return {
            error: error instanceof Error ? error.message : "User playGmae Unknown Error"
       }
    }
}

export const getUserGameInfo = async(userId: string, selectedGameId:string): Promise<userType.UserGameInfoResponse> => {
    try {       
        const userGameInfo = await prisma.userGame.findFirst({
            where: {
                userId: userId,
                gameId: selectedGameId,
            },
            select: {
                gameId: true,
                teamId: true,
                score: true
            }
        })

        if(!userGameInfo){
            throw new Error("No Game Active Now! in selectedGameId")
        }

        return {
            data: userGameInfo,
        }
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "UserGame Info Unknown Error"
        }
    }
}

export const getUserGameEvents = async(playInfo: userType.playGameInfo): Promise<userType.userScoreResponse> => {
    try {        
        const playGameInfo: userType.playGameInfo = {
            userId: playInfo.userId,
            gameId: playInfo.gameId,
            teamId: playInfo.teamId
        };

        if(!playGameInfo.userId || playGameInfo.userId == "") {
            throw new Error("UserId doesnt exist");
        }

        if(!playGameInfo.gameId || playGameInfo.gameId == "") {
            throw new Error("gameId doesnt exist");
        }

        const gameInfo = await prisma.game.findUnique({
            where: {
                gameId: playInfo.gameId
            },
            select: {
                status: true
            }
        })
        
        if(!gameInfo) throw new Error("There is no game data in database");
    
        const userInfo = await prisma.user.findUnique({
            where: {
                id: playInfo.userId
            },
            select: {
                score: true
            }
        })

        if(!userInfo) throw new Error("User doesn't exist");

        const userGame = await prisma.userGame.findUnique({
            where: {
                userId_gameId: {
                    userId: playInfo.userId,
                    gameId: playInfo.gameId
                }
            },
            select: {
                teamId: true,
                status: true,
                score: true,
                created_at: true,
            }
        })
        
        if(!userGame) throw new Error("This user is not playing the game");

        const gameActions = await prisma.gameAction.findMany({
            where: {
                gameId: playInfo.gameId
            },
            select: {
                id: true,
                gameId: true,
                teamId: true,
                actionId: true,
                scoreValue: true,
                actionTypes: true,
                created_at: true,
                description: true,
                awayScore: true,
                homeScore: true,
                game: {
                    select: {
                        period: true
                    }
                }
            }
        })
        
        if(!gameActions?.length) throw new Error("No game actions");

        let newActionScore = 0;
        let userGameActions: userType.userGameActionType[] = [];

        for (const action of gameActions) {
            let actionScore;
            if(action.scoreValue){

                actionScore = action.teamId === userGame.teamId? Number(action.actionTypes?.quantityValueSucc) : -Number(action.actionTypes.quantityValueSucc);
            } else {
                actionScore = action.teamId === userGame.teamId? Number(action.actionTypes?.quantityValue) : -Number(action.actionTypes.quantityValue);
            }
            // \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ NEED TO MODIFY TIMESTAMP \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
            if(action.created_at >= userGame.created_at) {
                newActionScore += actionScore;
            }

            // newActionScore += actionScore;

            if(!action.id) throw new Error("Cannot findaction Id");

            const existUserStats = await prisma.userStats.findFirst({
                where: {
                    gameActionId: action.id,
                    userId: playInfo.userId,
                    gameId: playInfo.gameId
                }
            })
          
            if (existUserStats) continue;
            
            const data = await prisma.userStats.create({
                data: {
                    userId: playInfo.userId,
                    gameId: action.gameId,
                    teamId: action.teamId,
                    gameActionId: action.id,
                    score: actionScore,
                    period: action.game.period,
                    created_at: new Date()
                },
                select: {
                    userId: true,
                    gameId: true,
                    score: true,
                    gameActionId: true,
                    period: true
                }
            });
            userGameActions.push(data);
        }

        const userGameData = await prisma.userGame.update({
            data: {
              status: gameInfo.status,
              score: userGame.score + newActionScore
            },
            where: {
                userId_gameId: {
                    userId: playInfo.userId,
                    gameId: playInfo.gameId
                }
            },
            select: {
                userId: true,
                score: true
            }
          })
        
        await prisma.user.update({
            data: {
              score: userInfo.score + newActionScore
            },
            where: {
              id: playInfo.userId
            }
          })
        
        return {
            data: userGameData
        }
    } catch (error) {
        let error_str = "";
        if(error instanceof Error) {
            error_str = error.message;
        } else {
            error_str = "PlayGame Unknown Error"
        }
        return {
            error: error_str
        }
    }
}

export const setUserGamePoints = async(playInfo: userType.UpdateUserGameInfo): Promise<userType.UpdateUserGameScoreResponse> => {
    try {  
        await prisma.user.update({
            where: {
              id: playInfo.userId
            },
            data: {
                score: {
                    increment: playInfo.initialScore // Increment the score instead of manually adding
                }
            }
        })      
        const userGameData = await prisma.userGame.update({
            where: {
                userId_gameId: {
                    userId: playInfo.userId,
                    gameId: playInfo.gameId
                }
            },
            data: {
                score: {
                    increment: playInfo.initialScore // Increment the score instead of manually adding
                },
                startScore: {
                    increment: playInfo.initialScore
                }
            },
            select: {
                userId: true,
                score: true
            }
        });        

        return {
            data: userGameData,
        }
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "User GamePoints Update Unknown Error"
        }
    }
}

export const getGetorLoassGamePointsAndSol = async (playInfo: userType.playGameInfo): Promise<userType.getLoassGamePointsAndSolResponse> => {
    try {
        const totalScore = await prisma.userStats.aggregate({
            where: {
                userId: playInfo.userId,
                gameId: playInfo.gameId
            },
            _sum: {
                score: true
            }
        });

        const startScore = await prisma.userGame.findUnique({
            where: {
                userId_gameId: {
                    userId: playInfo.userId,
                    gameId: playInfo.gameId
                }
            },
            select: {
                startScore: true
            }
        });
        
        if(!startScore) throw new Error("Start Score not found");
        const startScoreInSol = startScore.startScore / 200;

        const finalScore = totalScore._sum.score ?? 0; // Use nullish coalescing to default to 0 if null
        const finalScoreInSol = finalScore / 200;

        const finalData: userType.getLoassGamePointsAndSolResponseData = {
            score: finalScore,
            sol: finalScoreInSol,
            startScore: startScore.startScore,
            startSol: startScoreInSol
        }
        
        return {
            data: finalData
        }

    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "User GamePoints Update Unknown Error"
        }
    }
}
export const getUserGameDetails = async (playInfo: userType.playGameInfo): Promise<userType.DetailedUserGameResponse> => {
    try {        
        if (!playInfo.userId || playInfo.userId === "") {
            throw new Error("UserId doesn't exist");
        }
        if (!playInfo.gameId || playInfo.gameId === "") {
            throw new Error("gameId doesn't exist");
        }

        const additionalValues = await prisma.actionType.findMany({
            where: {
                id: {
                    in: [espnConfig.ASSIST_ADD_VALUE_ID, espnConfig.BLOCK_ADD_VALUE_ID, espnConfig.STEEL_ADD_VALUE_ID, espnConfig.THREE_POINT_ADD_VALUE_ID, espnConfig.WINNER_ACTION_ID]
                }
            },
            orderBy: {
                id: 'asc'
            },
            select: {
                id: true,
                actionType: true,
                quantityValue: true,
            }
        })

        // ✅ Fetch Game Status
        const gameInfo = await prisma.game.findUnique({
            where: { gameId: playInfo.gameId },
            select: { status: true, homeTeamId: true, awayTeamId: true }
        });
        if (!gameInfo) throw new Error("Game not found in database");

        // ✅ Fetch User Score
        const userInfo = await prisma.user.findUnique({
            where: { id: playInfo.userId },
            select: { score: true }
        });
        if (!userInfo) throw new Error("User doesn't exist");

        // ✅ Fetch User Game Data
        const userGame = await prisma.userGame.findUnique({
            where: {
                userId_gameId: {
                    userId: playInfo.userId,
                    gameId: playInfo.gameId
                }
            },
            select: {
                teamId: true,
                status: true,
                score: true,
                created_at: true,
            }
        });
        
        if (!userGame) throw new Error("User is not playing the game");

        // ✅ Fetch Game Actions
        const gameActions = await prisma.gameAction.findMany({
            where: {
                gameId: playInfo.gameId
            },
            orderBy: { created_at: 'asc' },
            select: {
                id: true,
                gameId: true,
                teamId: true,
                actionId: true,
                scoreValue: true,
                actionTypes: true,
                created_at: true,
                description: true,
                awayScore: true,
                homeScore: true,
                period: true,
                clock: true,
                // game: {
                //     select: {
                //         period: true
                //     }
                // }
            }
        });
        if (!gameActions?.length) throw new Error("The game is not started yet, Please wait...");

        // ✅ Fetch All Teams Playing in the Game
        const teams = await prisma.team.findMany({
            where: {
                OR: [
                    { homeGames: { some: { gameId: playInfo.gameId } } },
                    { awayGames: { some: { gameId: playInfo.gameId } } }
                ]
            },
            select: { id: true, name: true }
        });
        if (!teams.length) throw new Error("No teams found for this game."); 

        const teamScores = teams.map(team => {
            let teamScore = 0;
    
            if (team.id === gameInfo.homeTeamId) {
                teamScore = gameActions.find(action => action.actionId === espnConfig.WINNER_ACTION_ID)?.homeScore || 
                           gameActions[gameActions.length - 1]?.homeScore || 
                           0;
            } else {
                teamScore = gameActions.find(action => action.actionId === espnConfig.WINNER_ACTION_ID)?.awayScore || 
                           gameActions[gameActions.length - 1]?.awayScore || 
                           0;
            }
    
            return {
                teamId: team.id,
                teamName: team.name,
                totalScore: teamScore
            };
        });

        let newActionScore = 0;
        let winnerScore = 0;
        let winnerAction;
        let winnerTeamId: string = "";  
        let winnerTeamName: string = "";

        if(teamScores[0].totalScore > teamScores[1].totalScore){
            winnerTeamId = teamScores[0].teamId;
            winnerTeamName = teamScores[0].teamName;
        } else {
            winnerTeamId = teamScores[1].teamId;
            winnerTeamName = teamScores[1].teamName;
        }


        for (const action of gameActions) {

            if(action.actionId == espnConfig.WINNER_ACTION_ID){

                winnerAction = {
                    id: action.id,
                    action: espnConfig.GAME_STATUS_FINAL,
                    points:additionalValues.find(value => value.id === espnConfig.WINNER_ACTION_ID)?.quantityValue ?? 0,
                    side: winnerTeamName,
                    teamId: winnerTeamId,
                    time: {
                        displayValue: "0.0", // Adjust if clock comes from another field
                        period: action.period,
                    }
                };

                const existUserStats = await prisma.userStats.findFirst({
                    where: {
                        gameActionId: action.id,
                        userId: playInfo.userId,
                        gameId: playInfo.gameId
                    }
                });

                if(!existUserStats){
                    await prisma.userStats.create({
                        data: {
                            userId: playInfo.userId,
                            gameId: playInfo.gameId,
                            teamId: winnerTeamId,
                            gameActionId: action.id,
                            score: additionalValues.find(value => value.id === espnConfig.WINNER_ACTION_ID)?.quantityValue ?? 0,
                            period: action.period,
                            created_at: new Date()
                        },
                        select: {
                            userId: true,
                            gameId: true,
                            score: true,
                            gameActionId: true,
                            period: true
                        }
                    });

                    winnerScore = winnerTeamId == playInfo.teamId ? additionalValues.find(value => value.id === espnConfig.WINNER_ACTION_ID)?.quantityValue ?? 0 : -(additionalValues.find(value => value.id === espnConfig.WINNER_ACTION_ID)?.quantityValue ?? 0);

                }
            }

            if(action.teamId !== "0"){

                if (!action.id) throw new Error("Cannot find action Id");
                const existUserStats = await prisma.userStats.findFirst({
                    where: {
                        gameActionId: action.id,
                        userId: playInfo.userId,
                        gameId: playInfo.gameId
                    }
                });
                
                if (existUserStats) continue;

                let actionScore;
            
                if(action.scoreValue){
                    if(action.scoreValue == 2){
                        if(action.description.includes("assists")){
                            actionScore = action.teamId === userGame.teamId
                                ? Number(action.actionTypes?.quantityValue ?? 0) + (additionalValues.find(value => value.id === espnConfig.ASSIST_ADD_VALUE_ID)?.quantityValue ?? 0)
                                : -Number(action.actionTypes?.quantityValue ?? 0) - (additionalValues.find(value => value.id === espnConfig.ASSIST_ADD_VALUE_ID)?.quantityValue ?? 0);                                
                        } else{
                            actionScore = action.teamId === userGame.teamId
                                ? Number(action.actionTypes?.quantityValue ?? 0)
                                : -Number(action.actionTypes?.quantityValue ?? 0);
                        }
                    } else if(action.scoreValue == 3) {
                        if(action.description.includes("assists")){
                            actionScore = action.teamId === userGame.teamId
                                ? Number(action.actionTypes?.quantityValue ?? 0) + (additionalValues.find(value => value.id === espnConfig.THREE_POINT_ADD_VALUE_ID)?.quantityValue ?? 0) + (additionalValues.find(value => value.id === espnConfig.ASSIST_ADD_VALUE_ID)?.quantityValue ?? 0)
                                : -Number(action.actionTypes?.quantityValue ?? 0) - (additionalValues.find(value => value.id === espnConfig.THREE_POINT_ADD_VALUE_ID)?.quantityValue ?? 0) - (additionalValues.find(value => value.id === espnConfig.ASSIST_ADD_VALUE_ID)?.quantityValue ?? 0);
                        } else {
                            actionScore = action.teamId === userGame.teamId
                                ? Number(action.actionTypes?.quantityValue ?? 0) + (additionalValues.find(value => value.id === espnConfig.THREE_POINT_ADD_VALUE_ID)?.quantityValue ?? 0)
                                : -Number(action.actionTypes?.quantityValue ?? 0) - (additionalValues.find(value => value.id === espnConfig.THREE_POINT_ADD_VALUE_ID)?.quantityValue ?? 0);
                        }
                    } else {
                        actionScore = action.teamId === userGame.teamId
                            ? Number(action.actionTypes?.quantityValue ?? 0)
                            : -Number(action.actionTypes?.quantityValue ?? 0);
                    }
                } else {
                    if(action.description.includes("blocks")){
                        actionScore = action.teamId === userGame.teamId
                            ? additionalValues.find(value => value.id === espnConfig.BLOCK_ADD_VALUE_ID)?.quantityValue ?? 0
                            : -(additionalValues.find(value => value.id === espnConfig.BLOCK_ADD_VALUE_ID)?.quantityValue ?? 0);
                    } else if(action.description.includes("steals")) {
                        actionScore = action.teamId === userGame.teamId
                            ? -Number(action.actionTypes?.quantityValue ?? 0) - (additionalValues.find(value => value.id === espnConfig.STEEL_ADD_VALUE_ID)?.quantityValue ?? 0)
                            : Number(action.actionTypes?.quantityValue ?? 0) + (additionalValues.find(value => value.id === espnConfig.STEEL_ADD_VALUE_ID)?.quantityValue ?? 0);
                    } else if(action.description.includes("misses")) {
                        continue;
                    } else {
                        actionScore = action.teamId === userGame.teamId
                            ? Number(action.actionTypes?.quantityValue ?? 0)
                            : -Number(action.actionTypes?.quantityValue ?? 0);
                    }
                }

                // Modify timestamp logic if needed
                if (action.created_at >= userGame.created_at) {
                    newActionScore += actionScore;
                }

                if(action.description.includes("blocks")){
                    await prisma.userStats.create({
                        data: {
                            userId: playInfo.userId,
                            gameId: action.gameId,
                            teamId: action.teamId,
                            gameActionId: action.id,
                            score: additionalValues.find(value => value.id === espnConfig.BLOCK_ADD_VALUE_ID)?.quantityValue ?? 0,
                            period: action.period,
                            additionalType: additionalValues.find(value => value.id === espnConfig.BLOCK_ADD_VALUE_ID)?.actionType || "",
                            created_at: new Date()
                        },
                        select: {
                            userId: true,
                            gameId: true,
                            score: true,
                            gameActionId: true,
                            period: true
                        }
                    })
                } else {
                    if(action.description.includes("three")){
                        await prisma.userStats.create({
                            data: {
                                userId: playInfo.userId,
                                gameId: action.gameId,
                                teamId: action.teamId,
                                gameActionId: action.id,
                                score: Number(action.actionTypes?.pointsValue ?? 0) + (additionalValues.find(value => value.id === espnConfig.THREE_POINT_ADD_VALUE_ID)?.quantityValue ?? 0),
                                period: action.period,
                                additionalType: additionalValues.find(value => value.id === espnConfig.THREE_POINT_ADD_VALUE_ID)?.actionType || "",
                                created_at: new Date()
                            },
                            select: {
                                userId: true,
                                gameId: true,
                                score: true,
                                gameActionId: true,
                                period: true
                            }
                        });
                    } else {
                        await prisma.userStats.create({
                            data: {
                                userId: playInfo.userId,
                                gameId: action.gameId,
                                teamId: action.teamId,
                                gameActionId: action.id,
                                score: action.actionTypes?.pointsValue ?? 0,
                                period: action.period,
                                created_at: new Date()
                            },
                            select: {
                                userId: true,
                                gameId: true,
                                score: true,
                                gameActionId: true,
                                period: true
                            }
                        });
                    }
    
                    if(action.description.includes("assists")){
                        await prisma.userStats.create({
                            data: {
                                userId: playInfo.userId,
                                gameId: action.gameId,
                                teamId: action.teamId,
                                gameActionId: action.id,
                                score: additionalValues.find(value => value.id === espnConfig.ASSIST_ADD_VALUE_ID)?.quantityValue ?? 0,
                                period: action.period,
                                additionalType: additionalValues.find(value => value.id === espnConfig.ASSIST_ADD_VALUE_ID)?.actionType || "",
                                created_at: new Date()
                            },
                            select: {
                                userId: true,
                                gameId: true,
                                score: true,
                                gameActionId: true,
                                period: true
                            }
                        })
                    }
                    
                    if(action.description.includes("steals")){
                        let teamId = action.teamId === gameInfo.homeTeamId ? gameInfo.awayTeamId : gameInfo.homeTeamId;
                        await prisma.userStats.create({
                            data: {
                                userId: playInfo.userId,
                                gameId: action.gameId,
                                teamId: teamId,
                                gameActionId: action.id,
                                score: additionalValues.find(value => value.id === espnConfig.STEEL_ADD_VALUE_ID)?.quantityValue ?? 0,
                                period: action.period,
                                additionalType: additionalValues.find(value => value.id === espnConfig.STEEL_ADD_VALUE_ID)?.actionType || "",
                                created_at: new Date()
                            },
                            select: {
                                userId: true,
                                gameId: true,
                                score: true,
                                gameActionId: true,
                                period: true
                            }
                        })
                    }
                }
            }
        }

        if(winnerScore) {
            newActionScore += winnerScore;
        }

        await prisma.userGame.update({
            data: {
                status: gameInfo.status,
                score: userGame.score + newActionScore
            },
            where: {
                userId_gameId: {
                    userId: playInfo.userId,
                    gameId: playInfo.gameId
                }
            },
            select: {
                userId: true,
                score: true,
                status: true,
                startScore: true
            }
        });

        // ✅ Update Overall User Score
        await prisma.user.update({
            data: {
                score: userInfo.score + newActionScore
            },
            where: { id: playInfo.userId }
        });     

        const userGameData = await prisma.userGame.findUnique({
            where: {
                userId_gameId: {
                    userId: playInfo.userId,
                    gameId: playInfo.gameId
                }
            },
            select: {
                userId: true,
                score: true
            }
        })

        if(!userGameData) throw new Error("User Game Data not found");

        // ✅ Update User Game Score

        // ✅ Fetch Game Period & Clock
        const game = await prisma.game.findUnique({
            where: { gameId: playInfo.gameId },
            select: {
                period: true,
                actions: {
                    orderBy: { created_at: 'desc' },
                    take: 1,
                    select: { clock: true }
                },
            },
        });

        if (!game) throw new Error("Game not found");

        const periodClock: gameType.PeriodClockResponse = {
            data: {
                period: game.period,
                clock: gameActions.find(action => action.actionId === espnConfig.WINNER_ACTION_ID)?.clock || gameActions[gameActions.length - 1]?.clock || "",
            },
            error: ""
        };

        const actions = await prisma.userStats.findMany({
            where: { 
                gameId: playInfo.gameId,
                userId: playInfo.userId,
                score: { not: 0 }  // Fetch only records where score is not zero
            },
            orderBy: { created_at: 'asc' }, // Ordering by event creation time
            include: {
                actiontype: {  // Fetch related GameAction data
                    select: {
                        id: true,
                        description: true,
                        clock: true,
                        wallClock: true,
                        scoreValue: true,
                        homeScore: true,
                        awayScore: true,
                        actionTypes: {
                            select: { actionType: true, pointsValue: true }
                        }
                    }
                },
                teams: {  // Fetch related team data
                    select: { name: true }
                },
                game: {  // Fetch related game data
                    select: { period: true }
                }
            }
        });

        // Formatting the output to match the original structure
        const formattedActions: gameType.gameActionsResponse = {
            data: actions.map(action => ({
                id: action.actiontype.id,
                action: action.additionalType && action.additionalType !== additionalValues.find(value => value.id === espnConfig.THREE_POINT_ADD_VALUE_ID)?.actionType ? action.additionalType : action.actiontype.actionTypes?.actionType || "Unknown",
                points: action.score,
                side: action.teams?.name || "N/A",
                teamId: action.teamId,
                time: {
                    displayValue: action.actiontype.clock,
                    period: action.actiontype.actionTypes?.actionType === "Winner" ? 0 : action.period
                }
            })),
            error: ""
        };

        if(winnerAction){
            if(periodClock.data){
                periodClock.data = {...periodClock.data, clock: "0.0"}
            }
        }

        return {
            data : {
                userScore: userGameData,
                periodClock,
                gameActions: formattedActions,
                teamScores // Included teamScores in the response
            }
        };
    } catch (error) {
        return { error: error instanceof Error ? error.message : "UserGame Detail Info Unknown Error" };
    }
};

