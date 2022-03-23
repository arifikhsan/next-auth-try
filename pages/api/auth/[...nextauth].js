import axios from 'axios';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Custom Provider',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { username, password } = credentials;

        const response = await axios.post(
          'http://localhost:8080/api/v1/auth/login',
          { username, password }
        );

        if (response.status === 200) {
          let user = response.data.user;
          const { access_token, refresh_token } = response.data;
          user = { ...user, access_token, refresh_token };
          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
    async session({ session, user, token }) {
      if (token) {
        session.accessToken = token.accessToken;
      }
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.accessToken = user.access_token;
      }
      return token
    }
  },
  debug: true,
});
