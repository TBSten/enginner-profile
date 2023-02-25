import { addUserIfNotExists } from "@/lib/server/user"
import { User } from "@/types"
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { v4 as uuidv4 } from "uuid"

const CLIENT_ID = process.env.GCP_OAUTH_CLIENT_ID
const CLIENT_SECRET = process.env.GCP_OAUTH_CLIENT_SECRET
if (typeof CLIENT_ID !== "string") throw new Error("invalid google oauth client id")
if (typeof CLIENT_SECRET !== "string") throw new Error("invalid google oauth client secret")

console.log("OATH_CLIENT_ID", CLIENT_ID)
console.log("OATH_CLIENT_SECRET", CLIENT_SECRET)

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
            async profile(profile, tokens) {
                const userId = profile.sub
                const name = profile.name
                const image = profile.picture
                return {
                    type: "normal",
                    userId,
                    id: userId,
                    name,
                    image,
                }
            },
        }),
        CredentialsProvider({
            id: "anonymous",
            name: "匿名ログイン",
            credentials: {},
            async authorize() {
                const userId = "anonymous-" + uuidv4()
                return {
                    id: userId,
                    userId,
                    type: "anonymous",
                    name: "",
                }
            },
        }),
    ],
    callbacks: {
        signIn: async ({ user: nextAuthUser }) => {
            const user: User = {
                userId: nextAuthUser.id,
                name: nextAuthUser.name ?? "",
                type: nextAuthUser.type,
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
