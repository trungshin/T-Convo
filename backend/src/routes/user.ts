import { Router, RequestHandler } from 'express';
import * as userCtrl from '@controllers/user';
import { requireAuth } from '@middlewares/auth';

const router = Router();
router.get('/:username', requireAuth, userCtrl.getUser);

export default router;