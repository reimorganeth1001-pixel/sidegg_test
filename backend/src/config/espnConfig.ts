import dotenv from '@weirdorg/dotenv';

dotenv.config();

export const ESPN_SERVER = process.env.ESPN_SERVER || "ESPN Server"
export const ESPN_BASIC_URI=process.env.ESPN_BASIC_URI || "Basic uri"
export const ESPN_SUMMARY_API = process.env.ESPN_SUMMARY_API || "summary api";
export const ESPN_SCOREBOARD_API = process.env.ESPN_SCOREBOARD_API || "scoreboard api"
export const FETCH_INTERVAL = 60;
export const GAME_STATUS = process.env.ESPN_GAME_STATUS || "STATUS_IN_PROGRESS";

export const THREE_POINT_ADD_VALUE = 5;
export const THREE_MISS_SUB_SCORE = 2;
export const ASSIST_ADD_VALUE = 6;
export const BLOCK_ADD_VALUE = 8;
export const STEEL_ADD_VALUE = 8;
export const WINNER_ADD_SCORE = 30;
export const GAME_STATUS_FINAL = "Winner"
export const WINNER_ACTION_ID = "402";
export const ASSIST_ADD_VALUE_ID = "1002";
export const BLOCK_ADD_VALUE_ID = "1003";
export const STEEL_ADD_VALUE_ID = "1004";
export const THREE_POINT_ADD_VALUE_ID = "1005";
export const THREE_POINT_ADD_STRING = "Three Point Add";