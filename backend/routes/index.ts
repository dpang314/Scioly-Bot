import { Router } from 'express';
import templatesRouter from './templates';
import tournamentsRouter from './tournaments';

const router = Router();

router.use('/templates', templatesRouter);
router.use('/tournaments', tournamentsRouter);

export default router;
