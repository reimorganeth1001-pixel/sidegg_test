import express from 'express';

import { userController } from '../controller';

/**
 * User and gameplay REST routes, mounted at `/api/user`.
 *
 * This module is intentionally thin: validation + business logic live in controllers/features.
 */
const router = express.Router();

/** POST `/api/user/create` */
router.post("/create", userController.createUser);
/** POST `/api/user/play` */
router.post("/play", userController.playGame);
/** POST `/api/user/gamescore` */
router.post("/gamescore", userController.getUserGameEvents);
/** POST `/api/user/update` */
router.post("/update", userController.updateUser);
/** POST `/api/user/updateStatus` */
router.post("/updateStatus", userController.updateUserStatus);
/** POST `/api/user/getUserInfo` */
router.post("/getUserInfo", userController.getUserInfo);
/** POST `/api/user/getUserGameInfo` */
router.post("/getUserGameInfo", userController.getUserGameInfo);
/** POST `/api/user/setUserGamePoints` */
router.post("/setUserGamePoints", userController.setUserGamePoints);
/** POST `/api/user/userGameDetail` */
router.post("/userGameDetail", userController.getUserGameDetails);
/** POST `/api/user/getGetorLoassGamePointsAndSol` */
router.post("/getGetorLoassGamePointsAndSol", userController.getGetorLoassGamePointsAndSol);

export default router;