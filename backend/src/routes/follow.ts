import { Router } from 'express';
import * as followCtrl from '@controllers/follow';
import { requireAuth } from '@middlewares/auth';
const router = Router();
router.post('/:id/follow', requireAuth, followCtrl.followUserHandler);
router.delete('/:id/follow', requireAuth, followCtrl.unfollowUserHandler);
router.get('/:id/followers', requireAuth, followCtrl.getFollowersHandler);
router.get('/:id/following', requireAuth, followCtrl.getFollowingHandler);
export default router;