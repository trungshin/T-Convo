import { Router } from 'express';
import * as authCtrl from '@controllers/auth';
import { validate } from '@middlewares/validation';
import { registerValidation, loginValidation } from '@validators/auth';

const router = Router();
router.post('/register', validate(registerValidation), authCtrl.register);
router.post('/login', validate(loginValidation), authCtrl.login);
router.post('/refresh', authCtrl.refresh);
router.post('/logout', authCtrl.logout);
export default router;