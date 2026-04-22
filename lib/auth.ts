import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "./mongodb";
import User from "@/models/User";

// Hardcoded admin credentials
const ADMIN_EMAIL = "aasthajainokok@gmail.com";
const ADMIN_PASSWORD = "zademeadous2004";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                // Check if admin
                if (
                    credentials.email === ADMIN_EMAIL &&
                    credentials.password === ADMIN_PASSWORD
                ) {
                    return {
                        id: "admin",
                        name: "Aastha Jain",
                        email: ADMIN_EMAIL,
                        role: "admin",
                    };
                }

                // Otherwise check database for customer
                await dbConnect();

                const user = await User.findOne({ email: credentials.email });

                if (!user) {
                    throw new Error("User not found");
                }

                const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordMatch) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // @ts-ignore
                token.role = user.role;
                // @ts-ignore
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                // @ts-ignore
                session.user.role = token.role;
                // @ts-ignore
                session.user.id = token.id;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_development",
};
