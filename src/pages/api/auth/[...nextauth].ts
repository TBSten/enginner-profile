import { addUserIfNotExists, defaultIcon } from "@/lib/server/user"
import { User } from "@/types"
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { v4 as uuidv4 } from "uuid"

const CLIENT_ID = process.env.GCP_OAUTH_CLIENT_ID as string
const CLIENT_SECRET = process.env.GCP_OAUTH_CLIENT_SECRET as string

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
                icon: nextAuthUser.image ?? defaultIcon,
                type: nextAuthUser.type,
                lastNotificatonViewed: 0,
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
