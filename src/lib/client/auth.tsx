import { useSession as useNextAuthSession } from "next-auth/react"
import { useUser } from "./user"

export function useSession() {
    const nextAuthSession = useNextAuthSession()
    const { user, isLoading: isLoadingUser } = useUser(nextAuthSession.data?.user.userId ?? null)
    const session = {
        user,
    }
    const status =
        nextAuthSession.status === "loading"
            ? "loading"
            : nextAuthSession.status === "unauthenticated" ?
                "unauthenticated"
                : isLoadingUser
                    ? "loading"
                    : user?.type === "normal"
                        ? "authenticated"
                        : "unauthenticated"

    return {
        session,
        status,
    } as const
}
