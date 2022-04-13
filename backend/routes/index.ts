import { Router } from 'express';
import authRouter from './auth';
import templatesRouter from './templates';
import tournamentsRouter from './tournaments';

const router = Router();

router.use('/templates', templatesRouter);
router.use('/tournaments', tournamentsRouter);
router.use('/auth', authRouter);

export default router;
