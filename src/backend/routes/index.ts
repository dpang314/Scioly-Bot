import { Router } from 'express';
import templatesRouter from './templates';

const router = Router();

router.use('/templates', templatesRouter);

export default router;
