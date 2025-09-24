import { Router, RequestHandler } from 'express';
import * as postCtrl from '@controllers/post';
import { requireAuth } from '@middlewares/auth';
import upload from '@utils/multer';

const router = Router();
router.post('/', upload.single("media"), requireAuth, postCtrl.createPostHandler);
router.get('/', requireAuth, postCtrl.getFeedHandler as RequestHandler);
router.get('/user/:id', requireAuth, postCtrl.getPostFromUserHandler as RequestHandler);

export default router;