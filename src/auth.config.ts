import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcryptjs from 'bcryptjs';
import { getUserByEmail } from './actions';

const loggedUrls = [
  '/checkout/address',
  '/checkout',
  '/profile',
];

const adminUrls = [
  '/admin',
  '/admin/users',
  '/admin/products',
  '/admin/orders',
];

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      
      // const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      // if (isOnDashboard) {
      //   if (isLoggedIn) return true;
      //   return false; // Redirect unauthenticated users to login page
      // } else if (isLoggedIn) {
      //   return Response.redirect(new URL('/dashboard', nextUrl));
      // }

      // No dejar pasar si esta en el array de loggedUrl y no esta logueado y redirigir a login
      if (loggedUrls.includes(nextUrl.pathname) && !isLoggedIn) {
        
        return false;
      }

      const isInOrdersPage = nextUrl.pathname.startsWith('/orders');
      if (isInOrdersPage && !isLoggedIn) {

        return false;
      }

      // // No dejar pasar si esta en el array de loggedUrl y esta logueado y redirigir a home
      // if (loggedUrl.includes(nextUrl.pathname) && isLoggedIn) {
      //   return { redirect: { destination: '/', permanent: false } };
      // }

      // No dejar pasar si esta en el array de adminUrls y no es admin y redirigir a home
      if (adminUrls.includes(nextUrl.pathname) && auth?.user?.role !== 'admin') {
        
        return false;
      }
      
      return true;
    },
    async jwt({token, user}) {
      if (user) token.data = user;      
      
      return token;
    },
    async session({session, token, user}) {

      session.user = token.data as any;
      
      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

          if (!parsedCredentials.success) return null;

          const { email, password } = parsedCredentials.data;

          const user = await getUserByEmail(email);

          if (!user) return null;

          if (!bcryptjs.compareSync(password, user.password)) return null;

          const { password: _, ...rest } = user;
          
          return rest;
      },
    }),
  ]
};

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);
// export const { signIn, signOut, auth: middleware } = NextAuth(authConfig); //TODO: Add middleware