import express from 'express';

import game_route from './game';
import user_route from './user';
import code_route from './code';
import chat_route from './chat';

/**
 * Top-level REST router mounted under `/api` in `src/app.ts`.
 *
 * Each sub-router owns a resource area:
 * - `/api/game`
 * - `/api/user`
 * - `/api/code`
 * - `/api/chat`
 */
const router = express.Router();

router.use("/game", game_route);
router.use("/user", user_route);
router.use("/code", code_route);
router.use("/chat", chat_route);

export default router;