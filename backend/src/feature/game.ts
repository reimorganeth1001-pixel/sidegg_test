import prisma from '@/service/db';
import {
  defaultType,
  gameType,
  teamType,
} from '@/types';
import { game } from '.';

export const analyseGame = (data: any[]): gameType.AnalyseGameResponse => {
    const gameData: gameType.Game[] = [];
    const gameActions: gameType.GameAction[] = [];
    const teamData: teamType.Team[] = [];
    
    data.forEach(game => {      
      const gameResult = parseGameData(game);
      gameData.push(gameResult.data);
      const teamResult = parseTeamData(game);
      teamResult.data.forEach((team) => {
        if (teamData.find((t) => t.id === team.id)) return;
        teamData.push(team);
      })
  
      const gameActionssResult = parseGameAction(game);
      gameActions.push(...gameActionssResult.data);
    });
  
    return {
      games: gameData,
      teams: teamData,
      gameActions: gameActions
    }
  }

  const parseTeamData = (game: any): teamType.getTeamsResponse => {
    let teamData: teamType.Team[] = [];
   
    game?.boxscore?.teams.forEach((teams: any) => {
        teamData.push({
            id: teams.team?.id ?? "",
            slug: teams.team?.slug ?? "",
            location: teams.team?.location ?? "",
            name: teams.team?.name ?? "",
            abbbreviation: teams.team?.abbreviation ?? "",
            shortDisplayName: teams.team?.shortDisplayName ?? "",
            logo: teams.team?.logo ?? "",
            displayName: teams.team?.displayName ?? ""
        })
    })
  
    return {
      data: teamData
    }
  };
  
  const parseGameData = (game: any): gameType.ParseGameDataResponse => {
    let gameData: gameType.Game = {
        gameId: '',
        fullName: '',
        shortName: '',
        city: '',
        state: '',
        logo: '',
        homeTeamId: '',
        awayTeamId: '',
        status: '',
        period: 0,
        startTime: '',
        lastUpdated: ''
    };
  
    let homeTeamIndex = 0;
    homeTeamIndex = game?.boxscore?.teams[0].homeAway == "home" ? 0 : 1;
  
    gameData.gameId = game?.header?.id ?? "";
    gameData.fullName = game?.gameInfo?.venue?.fullName ?? "";
    gameData.shortName = game?.gameInfo?.venue?.shortName ?? "";
    gameData.city = game?.gameInfo?.venue?.address?.city ?? "";
    gameData.state = game?.gameInfo?.venue?.address?.state ?? "";
    gameData.logo = game?.gameInfo?.venue?.images[0]?.href ?? "";
    gameData.homeTeamId = game?.boxscore?.teams[homeTeamIndex]?.team?.id ?? "";
    gameData.awayTeamId = game?.boxscore?.teams[(homeTeamIndex + 1) % 2]?.team?.id ?? "";
    gameData.status = game?.status ?? "";
    gameData.period = game?.period ?? 0;
    gameData.startTime = game?.startDate ?? "";
  
    return {
      data: gameData
    }
  };
  
  const parseGameAction = (game: any): gameType.ParseGameActionResponse => {
    const gameActionData: gameType.GameAction[] = [];
  
    const plays = game?.plays;
    if(!plays) {
      return {
        data: gameActionData
      }
    }
  
    for (const [index, action] of plays.entries()) {
        // if(!action?.team?.id) {
        //     continue;
        // }
        // events.forEach((event: any) => {
        gameActionData.push({
          id: action?.type?.id ?? "",
          actionType: action?.type?.text ?? "",
          gameId: action?.id?.substring(0, game?.header?.id?.length ?? 0) ?? "",
          teamId: action?.team?.id ?? "0",
          uid: action?.id ?? "",
          description: action?.text ?? "",
          clock: action?.clock?.displayValue ?? "",
          period: action?.period?.number ?? 0,
          wallClock: action?.wallclock ?? "",
          scoreValue: action?.scoreValue ?? "",
          awayScore: action?.awayScore ?? 0,
          homeScore: action?.homeScore ?? 0
        })

    }; 
  
    return {
      data: gameActionData
    }
  };

export const updateGames = async(games: gameType.Game[]): Promise<defaultType.dbGetResponse> => {
    try {
        for (const game of games) {
            await prisma.game.upsert({
                where: { 
                    gameId: game.gameId
                },
                update: {
                    fullName: game.fullName,
                    shortName: game.shortName,
                    city: game.city,
                    state: game.state,
                    logo: game.logo,
                    homeTeamId: game.homeTeamId,
                    awayTeamId: game.awayTeamId,
                    status: game.status,
                    period: game.period,
                    lastUpdated: new Date(),
                },
                create: {
                    gameId: game.gameId,
                    fullName: game.fullName,
                    shortName: game.shortName,
                    city: game.city,
                    state: game.state,
                    logo: game.logo,
                    homeTeamId: game.homeTeamId,
                    awayTeamId: game.awayTeamId,
                    status: game.status,
                    period: game.period,
                    startTime: new Date(game.startTime),
                    lastUpdated: new Date(),
                }
            })
        };
        return {
            success: true
        }
    } catch (error) {
        return {
            error: "Insert game record error"
        }
    }
}

export const updateGameActions = async(actions: gameType.GameAction[]): Promise<defaultType.dbGetResponse> => {
    try {
        for (const [index, action] of actions.entries()) {
            const existingActionType = await prisma.actionType.findUnique({
                where: { id: action.id },
            });
        
            if (!existingActionType) {
                await prisma.actionType.create({
                    data: {
                        id: action.id,
                        actionType: action.actionType,
                        // score: action.scoreValue,
                        // pointsValue: 0,
                        // quantityValue: 0,
                        // quantityValueSucc: 0,
                        created_at: new Date()
                    }
                })
            }

            const existingGameAction = await prisma.gameAction.findUnique({
                where: { id: action.uid },
            });

            if(existingGameAction) continue;
            
            await prisma.gameAction.create({
              data: { 
                gameId: action.gameId,
                teamId: action.teamId,
                actionId: action.id,
                id: action.uid,
                description: action.description,
                clock: action.clock,
                wallClock: action.wallClock,
                period: action.period,
                scoreValue: action.scoreValue,
                awayScore: action.awayScore,
                homeScore: action.homeScore,
                created_at: new Date()
              }
            });
          }
        return {
            success: true
        }
    } catch (error) {
        let error_str = "";
        if(error instanceof Error) {
            error_str = error.message;
        } else  {
            error_str = "Insert action record unknown error"
        }
        return {
            error: error_str
        }
    }
}

export const fetchGameActions = async (gameId: string): Promise<gameType.gameActionsResponse> => {
  try {
    const actions = await prisma.gameAction.findMany({
      where: { 
        gameId,
        actionTypes: { 
          pointsValue: { not: 0 } // Only return records where pointsValue is not 0
        }
      },
      orderBy: { created_at: 'asc' },
      include: {
        actionTypes: {
          select: {
            actionType: true,
            pointsValue: true,
          }
        },
        team: {
          select: {
            name: true
          }
        },
        game: {
          select: {
            period: true
          }
        }
      }
    });

    const formattedActions = actions.map(action => {
      // Force period to 0 for "Winner", otherwise use the game's period.
      const period = action.actionTypes.actionType === "Winner" ? 0 : action.game.period;
      return {
        id: action.id,
        action: action.actionTypes.actionType,
        points: action.actionTypes.pointsValue,
        side: action.team.name,
        teamId: action.teamId,
        time: {
          displayValue: action.clock,
          period: period,
        }
      };
    });

    return {
      data: formattedActions,
      error: ""
    };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : "Unknown Error"
    };
  }
};

export const fetchGameScore = async (gameId: string, teamName: string): Promise<gameType.TeamScoreResponse> => {
  try {
    const team = await prisma.team.findFirst({
      where: { name: teamName},
      select: { id: true }
    });

    if (!team) {
        throw new Error("Team not found");
    }

    const totalScore = await prisma.gameAction.aggregate({
      where: {
          gameId: gameId,
          teamId: team.id
      },
      _sum: {
          scoreValue: true
      }
  });

    return {
      data: totalScore._sum.scoreValue ?? 0,
      error: ""
    };
  } catch (error) {
    return {
      data: 0,
      error: error instanceof Error ? error.message : "Unknown Error"
    };
  }
};


export const fetchGameInitialInfo = async (status: string, selectedGameId?: string): Promise<gameType.DetailedGameResponse> => {
  try {
    let games;
    let formattedGames: gameType.DetailedGame[] = [];
    if(selectedGameId){
      games = await prisma.game.findFirst({
        where: {
          gameId: selectedGameId
        },
        select: {
          gameId: true,
          fullName: true,
          shortName: true,
          city: true,
          state: true,
          logo: true,
          homeTeamId: true,
          awayTeamId: true,
          status: true,
          period: true,
          startTime: true,
          lastUpdated: true,
          teamA: {
              select: {
                  id: true,
                  name: true,
                  abbbreviation: true,
                  location: true,
                  displayName: true,
                  shortDisplayName: true,
                  slug: true,
                  logo: true,
              },
          },
          teamB: {
              select: {
                  id: true,
                  name: true,
                  abbbreviation: true,
                  location: true,
                  displayName: true,
                  shortDisplayName: true,
                  slug: true,
                  logo: true,
              },
          },
        },
      });

      if(games){
        formattedGames.push({...games,
          startTime: games.startTime.toISOString(),
          lastUpdated: games.lastUpdated.toISOString()})
      }
    } else {
      games = await prisma.game.findMany({
        where: { status },
        // orderBy:{
        //   startTime: 'asc'
        // },
        select: {
            gameId: true,
            fullName: true,
            shortName: true,
            city: true,
            state: true,
            logo: true,
            homeTeamId: true,
            awayTeamId: true,
            status: true,
            period: true,
            startTime: true,
            lastUpdated: true,
            teamA: {
                select: {
                    id: true,
                    name: true,
                    abbbreviation: true,
                    location: true,
                    displayName: true,
                    shortDisplayName: true,
                    slug: true,
                    logo: true,
                },
            },
            teamB: {
                select: {
                    id: true,
                    name: true,
                    abbbreviation: true,
                    location: true,
                    displayName: true,
                    shortDisplayName: true,
                    slug: true,
                    logo: true,
                },
            },
        },
      });

      games.map((gameItem) => {
        formattedGames.push({
          ...gameItem,
          startTime: gameItem.startTime.toISOString(),
          lastUpdated: gameItem.lastUpdated.toISOString() 
        });      
      });
    }

    if (formattedGames.length < 1) {
      throw new Error('Game not found');
    }    

    return {
      data: formattedGames,
      error: ""
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown Error"
    };
  }
};


export const fetchPeriodClock = async (gameId: string): Promise<gameType.PeriodClockResponse> => {
  try {
    const game = await prisma.game.findUnique({
      where: { gameId },
      select: {
        period: true, // Get the current period
        actions: {
          orderBy: { created_at: 'desc' }, // Get the latest action
          take: 1,
          select: { clock: true }, // Fetch latest clock
        },
      },
    });
  
    if (!game) {
      throw new Error('Game not found');
    }

    const data: gameType.gamePeriodClock = {
      period: game.period,
      clock: game.actions.length > 0 ? game.actions[0].clock : "",
    }

    return {
      data: data,
      error: ""
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown Error"
    };
  }
};


