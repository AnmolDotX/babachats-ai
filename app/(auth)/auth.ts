import { compare } from "bcrypt-ts";
import NextAuth, { type DefaultSession } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { DUMMY_PASSWORD } from "@/lib/constants";
import { createGuestUser, getUser } from "@/lib/db/queries";
import { generateDummyPassword } from "@/lib/db/utils";
import { user } from "@/lib/db/schema";
import { authConfig } from "./auth.config";

const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export type UserType = "guest" | "regular";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      type: UserType;
    } & DefaultSession["user"];
  }

  // biome-ignore lint/nursery/useConsistentTypeDefinitions: "Required"
  interface User {
    id?: string;
    email?: string | null;
    type: UserType;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    type: UserType;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        const users = await getUser(email);

        if (users.length === 0) {
          await compare(password, DUMMY_PASSWORD);
          return null;
        }

        const [foundUser] = users;

        if (!foundUser.password) {
          await compare(password, DUMMY_PASSWORD);
          return null;
        }

        const passwordsMatch = await compare(password, foundUser.password);

        if (!passwordsMatch) {
          return null;
        }

        return { ...foundUser, type: "regular" };
      },
    }),
    Credentials({
      id: "guest",
      credentials: {},
      async authorize() {
        const [guestUser] = await createGuestUser();
        return { ...guestUser, type: "guest" };
      },
    }),
  ],
  callbacks: {
    async signIn({ user: authUser, account, profile }) {
      // Handle Google OAuth sign-in
      if (account?.provider === "google" && authUser.email) {
        const existingUsers = await getUser(authUser.email);
        
        if (existingUsers.length === 0) {
          // Create new user for Google OAuth
          const [newUser] = await db
            .insert(user)
            .values({
              email: authUser.email,
              name: authUser.name || profile?.name,
              image: authUser.image || (profile as any)?.picture,
              password: generateDummyPassword(), // OAuth users get dummy password
            })
            .returning();
          
          // Set the user id for the token
          authUser.id = newUser.id;
        } else {
          // User exists, update their image if they don't have one
          const existingUser = existingUsers[0];
          authUser.id = existingUser.id;
          
          // Optionally update image from Google if user doesn't have one
          if (!existingUser.image && (authUser.image || (profile as any)?.picture)) {
            await db
              .update(user)
              .set({ 
                image: authUser.image || (profile as any)?.picture,
                name: existingUser.name || authUser.name || profile?.name,
              })
              .where(eq(user.id, existingUser.id));
          }
        }
        
        // Set type for OAuth users
        authUser.type = "regular";
      }
      
      return true;
    },
    jwt({ token, user: authUser }) {
      if (authUser) {
        token.id = authUser.id as string;
        token.type = authUser.type || "regular";
        // Include name in token
        if (authUser.name) {
          token.name = authUser.name;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Verify user exists in DB to prevent FK violations with stale tokens
        const users = await getUser(session.user.email);
        const userExists = users.some((u) => u.id === token.id);

        if (!userExists) {
          // If user doesn't exist (e.g. DB reset), we shouldn't return a valid session
          // This will force a re-login
          // @ts-expect-error
          session.user = null;
          return session;
        }

        session.user.id = token.id;
        session.user.type = token.type;
        
        // Get fresh name and image from DB
        const dbUser = users.find((u) => u.id === token.id);
        if (dbUser?.name) {
          session.user.name = dbUser.name;
        }
        if (dbUser?.image) {
          session.user.image = dbUser.image;
        }
      }

      return session;
    },
  },
});

