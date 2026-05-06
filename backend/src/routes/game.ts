import express from 'express';

import { gameController } from '../controller';

const router = express.Router();

// ROUTES * /api/auth/
router.get("/event", gameController.getGameEvent);
router.get("/raw", gameController.getRawGameEvents);
router.post("/search", gameController.searchGameInfo);
router.post("/actions", gameController.fetchGameActions);
router.post("/score", gameController.fetchGameScore);
router.post("/clock-period", gameController.fetchPeriodClock);
router.post("/initialGame", gameController.fetchGameInitialInfo);

export default router;