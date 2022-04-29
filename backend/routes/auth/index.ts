import { NODE_ENV } from '../../configLoader';
import { Router } from 'express';
import passport from 'passport';

const authRouter = Router();

authRouter.get('/discord', passport.authenticate('discord'));

authRouter.get('/discord/callback', passport.authenticate('discord', {
    successRedirect: NODE_ENV == 'development' ? 'http://localhost:3000/' : '/',
    failureRedirect: NODE_ENV == 'development' ? 'http://localhost:3000/' : '/',
    failureMessage: true
}));

authRouter.get('/discord/user', async (req, res) => {
    res.json(req.user);
})

export default authRouter;