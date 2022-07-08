import {CLIENT_ID, DISCORD_SECRET} from 'scioly-bot-config';
import passport from 'passport';
import {Strategy as DiscordStrategy} from 'passport-discord';
import {User} from 'scioly-bot-models';

passport.serializeUser((user, done) => {
  if (user instanceof User) {
    return done(null, (user as User).id);
  } else {
    done(new Error('Invalid user'), null);
  }
});
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findByPk(id);
    return done(null, user);
  } catch (err) {
    console.error(err);
    done(err, null);
  }
});

passport.use(
  new DiscordStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: DISCORD_SECRET,
      callbackURL: '/auth/discord/callback',
      scope: ['identify'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const {id, username} = profile;
        let user = await User.findByPk(id);
        if (!user) {
          user = await User.create({
            id,
            discordName: username,
          });
        }
        return done(null, user);
      } catch (error) {
        console.error(error);
        return done(error, null);
      }
    },
  ),
);
