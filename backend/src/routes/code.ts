import express from 'express';

import { codeController } from '../controller';

/**
 * Code verification REST routes, mounted at `/api/code`.
 */
const router = express.Router();

/**
 * POST `/api/code/searchCodeAndUpdateStatus`
 * Body: `{ code: string }`
 */
router.post("/searchCodeAndUpdateStatus", codeController.searchCodeAndUpdateStatus);

export default router;