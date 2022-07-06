import {Router} from 'express';
import templatesRouter from './templates';
import tournamentEventsRouter from './tournamentEvents';
import tournamentsRouter from './tournaments';

const apiRouter = Router();

apiRouter.use('/templates', templatesRouter);
apiRouter.use('/tournaments', tournamentsRouter);
apiRouter.use('/tournaments', tournamentEventsRouter);

export default apiRouter;
