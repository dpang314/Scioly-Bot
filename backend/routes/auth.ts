import { Router } from 'express';
import passport from 'passport';

const authRouter = Router();

authRouter.get('/discord', passport.authenticate('discord'));

authRouter.get('/discord/callback', passport.authenticate('discord', {
    successRedirect: '/',
    failureRedirect: '/login',
}));

export default authRouter;