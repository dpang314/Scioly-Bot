import {Router} from 'express';
import authRouter from './auth';
import apiRouter from './api';

const router = Router();

// Authenticating should not require authentication
router.use('/auth', authRouter);

router.use((req, res, next) => {
  if (!req.user) {
    res.status(401).send('Unauthorized');
  } else {
    next();
  }
});

router.use('/', apiRouter);

export default router;
