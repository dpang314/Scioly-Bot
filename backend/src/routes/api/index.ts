import {Router} from 'express';
import templateEventsRouter from './templateEvents';
import templatesRouter from './templates';
import tournamentEventsRouter from './tournamentEvents';
import tournamentsRouter from './tournaments';

const apiRouter = Router();

apiRouter.use('/templates', templatesRouter);
apiRouter.use('/templates', templateEventsRouter);
apiRouter.use('/tournaments', tournamentsRouter);
apiRouter.use('/tournaments', tournamentEventsRouter);

export default apiRouter;
