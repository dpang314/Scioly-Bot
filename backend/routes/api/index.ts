import { Router } from 'express';
import templatesRouter from './templates';
import tournamentsRouter from './tournaments';

const apiRouter = Router();

apiRouter.use('/templates', templatesRouter);
apiRouter.use('/tournaments', tournamentsRouter);


export default apiRouter;
