import "next-auth"

declare module "next-auth" {
    interface User {
        type: "anonymous" | "normal"
        userId: string
    }
    interface Session {
        user: {
            type: "anonymous" | "normal"
            userId: string
        }
    }
}