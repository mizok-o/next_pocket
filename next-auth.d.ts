import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user']; // name, email, image を保持
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
  }
}
