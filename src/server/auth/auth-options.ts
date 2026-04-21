import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import type { PlatformRole, TenantRoleCode } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: parsed.data.email,
          },
          include: {
            userRoles: {
              include: {
                role: true,
                company: true,
                unit: true,
              },
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        });

        if (!user || !user.isActive) {
          return null;
        }

        const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);

        if (!isValid) {
          return null;
        }

        const defaultMembership =
          user.userRoles.find((membership) => membership.isDefault) ?? user.userRoles[0];

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          platformRole: user.platformRole,
          currentCompanyId: defaultMembership?.companyId ?? null,
          currentUnitId: defaultMembership?.unitId ?? null,
          roleContext: defaultMembership?.role.code ?? null,
          memberships: user.userRoles.map((membership) => ({
            companyId: membership.companyId,
            companyName: membership.company.name,
            unitId: membership.unitId,
            unitName: membership.unit?.name ?? null,
            roleCode: membership.role.code,
          })),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.platformRole = user.platformRole;
        token.currentCompanyId = user.currentCompanyId;
        token.currentUnitId = user.currentUnitId;
        token.roleContext = user.roleContext;
        token.memberships = user.memberships;
      }

      if (trigger === "update" && session) {
        token.currentCompanyId = session.currentCompanyId ?? token.currentCompanyId;
        token.currentUnitId = session.currentUnitId ?? token.currentUnitId;
        token.roleContext = session.roleContext ?? token.roleContext;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.platformRole = (token.platformRole as PlatformRole) ?? "USER";
        session.user.currentCompanyId = (token.currentCompanyId as string | null) ?? null;
        session.user.currentUnitId = (token.currentUnitId as string | null) ?? null;
        session.user.roleContext = (token.roleContext as TenantRoleCode | null) ?? null;
        session.user.memberships =
          (token.memberships as
            | {
                companyId: string;
                companyName: string;
                unitId: string | null;
                unitName: string | null;
                roleCode: TenantRoleCode;
              }[]
            | undefined) ?? [];
      }

      return session;
    },
  },
};
