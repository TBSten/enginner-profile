import { User, UserSchema } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { signIn, useSession as useNextAuthSession } from "next-auth/react";
import { useEffect } from "react";


export function useUser(userId: string | null) {
    const query = useQuery({
        queryKey: ["user", userId],
        queryFn: () => userId ? fetch(`/api/user/${userId}`).then(r => r.json()) : null,
        select: (data) => data === null ? null : UserSchema.parse(data),
    })

    if (query.isLoading) {
        return {
            isLoading: query.isLoading,
        } as const
    } else {
        return {
            isLoading: query.isLoading,
            error: query.error,
            user: query.data as User,
        } as const
    }
}

export function useSessionUser() {
    const naSession = useNextAuthSession()
    const userId = naSession.data?.user.userId ?? null
    const session = useUser(userId)
    useEffect(() => {
        if (naSession.status === "unauthenticated") {
            signIn("anonymous", { redirect: false })
        }
    }, [naSession.status])

    return session
}
