import express from 'express';

import { chatController } from '../controller';

/**
 * Chat REST routes, mounted at `/api/chat`.
 */
const router = express.Router();

/**
 * POST `/api/chat/getMessages`
 * Body: `{ gameId: string }`
 */
router.post("/getMessages", chatController.fetchMessages);

export default router;