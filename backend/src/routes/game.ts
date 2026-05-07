import express from 'express';

import { gameController } from '../controller';

/**
 * Game-related REST routes, mounted at `/api/game`.
 */
const router = express.Router();

/**
 * GET `/api/game/event`
 * Triggers an event refresh and returns processed ESPN data (debug-friendly).
 */
router.get("/event", gameController.getGameEvent);

/**
 * GET `/api/game/raw`
 * Returns the unprocessed upstream ESPN payload.
 */
router.get("/raw", gameController.getRawGameEvents);

/**
 * POST `/api/game/search`
 * Body: `{ gameId: string }`
 */
router.post("/search", gameController.searchGameInfo);

/**
 * POST `/api/game/actions`
 * Body: `{ gameId: string }`
 */
router.post("/actions", gameController.fetchGameActions);

/**
 * POST `/api/game/score`
 * Body: `{ gameId: string, teamName: string }`
 */
router.post("/score", gameController.fetchGameScore);

/**
 * POST `/api/game/clock-period`
 * Body: `{ gameId: string }`
 */
router.post("/clock-period", gameController.fetchPeriodClock);

/**
 * POST `/api/game/initialGame`
 * Body: `{ status: <status>, selectedGameId?: string }`
 */
router.post("/initialGame", gameController.fetchGameInitialInfo);

export default router;