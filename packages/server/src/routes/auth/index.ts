import {NODE_ENV} from 'scioly-bot-config';
import {Router} from 'express';
import passport from 'passport';

const authRouter = Router();

authRouter.get('/discord', passport.authenticate('discord'));

authRouter.get(
  '/discord/callback',
  passport.authenticate('discord', {
    successRedirect: NODE_ENV == 'development' ? 'http://localhost:3000/' : '/',
    failureRedirect: NODE_ENV == 'development' ? 'http://localhost:3000/' : '/',
    failureMessage: true,
  }),
);

authRouter.get('/discord/user', async (req, res) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(401).send('Unauthorized');
  }
});

authRouter.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect(NODE_ENV == 'development' ? 'http://localhost:3000/' : '/');
  });
});

export default authRouter;
