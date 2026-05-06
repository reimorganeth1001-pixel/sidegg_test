import express from 'express';

import { codeController } from '../controller';

const router = express.Router();

// ROUTES * /api/auth/
router.post("/searchCodeAndUpdateStatus", codeController.searchCodeAndUpdateStatus);

export default router;