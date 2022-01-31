import axios from 'axios';
import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
      authorization: { params: { scope: 'identify guilds'} },
      token: "https://discord.com/api/oauth2/token",
      userinfo: "https://discord.com/api/users/@me",
    })
  ],
  secret: process.env.NEXT_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token
    },
    async session({ session, token }) {
      session.id = token.id;
      return session
    },
    async signIn({ account }) {
      const isAllowedToSignIn = true
      if (isAllowedToSignIn) {
        const headers = { 'Authorization': `Bearer ${account.access_token}` };
        try {
            const guilds = (await axios.get('https://discord.com/api/users/@me/guilds', { headers: headers }))['data'];
            for (const guild of guilds) {
              // Admin of server
              if (guild.id === process.env.GUILD_ID && (guild.permissions & (1 << 3))) {
                return true;
              }
            }
            return false;
        } catch (error) {
          console.error(error);
          return false;
        }
      } else {
        // Return false to display a default error message
        return false
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    }
  }
})