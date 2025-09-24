import { Router } from 'express';
import auth from './auth';
import users from './user';
import posts from './post';
// import comments from './comment.routes';
import follows from './follow';
// import upload from './upload.routes';
// import notifications from './notification.routes';


const router = Router();
router.use('/auth', auth);
router.use('/user', users);
router.use('/post', posts);
// router.use('/', comments);
router.use('/', follows);
// router.use('/upload', upload);
// router.use('/notifications', notifications);

export default router;