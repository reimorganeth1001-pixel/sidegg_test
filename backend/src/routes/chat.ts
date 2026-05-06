import express from 'express';

import { chatController } from '../controller';

const router = express.Router();

// ROUTES * /api/auth/
router.post("/getMessages", chatController.fetchMessages);

export default router;