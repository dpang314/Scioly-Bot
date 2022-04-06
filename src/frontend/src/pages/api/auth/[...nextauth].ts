import axios from 'axios';
import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { CLIENT_ID, DISCORD_SECRET, NEXT_SECRET } from '../../../../../configLoader';

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: CLIENT_ID,
      clientSecret: DISCORD_SECRET,
      authorization: { params: { scope: 'identify guilds' } },
      token: 'https://discord.com/api/oauth2/token',
      userinfo: 'https://discord.com/api/users/@me',
    }),
  ],
  secret: NEXT_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // eslint-disable-next-line no-param-reassign
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // eslint-disable-next-line no-param-reassign
      session.id = token.id;
      return session;
    },
    async signIn({ account }) {
      const headers = { Authorization: `Bearer ${account.access_token}` };
      try {
        const guilds = (await axios.get('https://discord.com/api/users/@me/guilds', { headers })).data;
        for (let i = 0; i < guilds.length; i += 1) {
          // Admin of server
          // eslint-disable-next-line no-bitwise
          if (guilds[i].id === process.env.GUILD_ID && (guilds[i].permissions & (1 << 3))) {
            return true;
          }
        }
        return '/unauthorized';
      } catch (error) {
        return '/unauthorized';
      }
    },
  },
});
