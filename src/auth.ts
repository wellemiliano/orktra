import NextAuth from "next-auth";
import { authConfig } from "@/server/auth/auth-options";

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);

