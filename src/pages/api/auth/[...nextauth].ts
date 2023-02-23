import { addUserIfNotExists } from "@/lib/server/user"
import { User } from "@/types"
import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const CLIENT_ID = process.env.GCP_OAUTH_CLIENT_ID
const CLIENT_SECRET = process.env.GCP_OAUTH_CLIENT_SECRET
if (typeof CLIENT_ID !== "string") throw new Error("invalid google oauth client id")
if (typeof CLIENT_SECRET !== "string") throw new Error("invalid google oauth client secret")

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            },
        }),
    ],
    callbacks: {
        signIn: async ({ user: nextAuthUser }) => {
            const user: User = {
                userId: nextAuthUser.id,
                name: nextAuthUser.name ?? "",
                type: "normal",
            }
            await addUserIfNotExists(user)
            return true
        },
        session: async ({ session, token }) => {
            if (session?.user && typeof token.uid === "string") {
                session.user.userId = token.uid;
            }
            return session;
        },
        jwt: async ({ user, token }) => {
            if (user) {
                token.uid = user.id;
            }
            return token;
        },
    },
}

export default NextAuth(authOptions)
