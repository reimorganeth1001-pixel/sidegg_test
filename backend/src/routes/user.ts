import express from 'express';

import { userController } from '../controller';

const router = express.Router();

// ROUTES * /api/auth/
router.post("/create", userController.createUser);
router.post("/play", userController.playGame);
router.post("/gamescore", userController.getUserGameEvents);
router.post("/update", userController.updateUser);
router.post("/updateStatus", userController.updateUserStatus);
router.post("/getUserInfo", userController.getUserInfo);
router.post("/getUserGameInfo", userController.getUserGameInfo);
router.post("/setUserGamePoints", userController.setUserGamePoints);
router.post("/userGameDetail", userController.getUserGameDetails);
router.post("/getGetorLoassGamePointsAndSol", userController.getGetorLoassGamePointsAndSol);

export default router;