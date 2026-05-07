import {
  espn,
  game,
  team,
} from '@/feature';

/**
 * Fetches the latest NBA dataset from ESPN and persists the derived entities.
 *
 * Pipeline:
 * - Fetch + parse upstream data (`espn.fetchNBAData`)
 * - Upsert teams (`team.updateTeams`)
 * - Upsert games (`game.updateGames`)
 * - Insert new game actions + ensure action types exist (`game.updateGameActions`)
 *
 * Error handling:
 * - This function logs errors and returns `void` so it can be used safely from timers.
 */
export const getAndUpdateEvents = async() => {
    try {
        const result = await espn.fetchNBAData();

        if(result.error) {
            throw new Error(result.error);
        }

        if(!result.data?.teams) {
            throw new Error("Parse team data failed");
        }

        const update_team_result = await team.updateTeams(result.data.teams);

        if(update_team_result.error) {
            throw new Error(update_team_result.error);
        }

        if(!result.data?.games) {
            throw new Error("Parse game data failed");
        }
        const update_game_result = await game.updateGames(result.data.games);

        if(update_game_result.error) {
            throw new Error(update_game_result.error);
        }

        const insert_action_result = await game.updateGameActions(result.data.gameActions);

        if(insert_action_result.error) {
            throw new Error(insert_action_result.error);
        }
    } catch (error) {
        if(error instanceof Error) {
            console.log("Fetch NBA Data Error: ", error.message);
        } else {
            console.log("Fetch NBA Data Unknown Error: ", error);
        }
    }    
}