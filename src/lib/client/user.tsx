import { UserSchema } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "./auth";

export function useSessionUser() {
    const { data: session, status } = useSession()
    const userId = session?.user.userId ?? null
    const {
        user,
        isLoading: isLoadingUser,
    } = useUser(userId)
    return {
        isLoading: status === "loading" || isLoadingUser,
        user,
    }
}
export function useUser(userId: string | null) {
    const { isLoading, error, data: user } = useQuery({
        queryKey: ["user", userId],
        queryFn: () =>
            userId
                ? fetch(`/api/user/${userId}`)
                    .then(r => r.json())
                    .then(r => UserSchema.parse(r))
                : null,
    })

    if (isLoading) {
        return {
            isLoading,
        }
    } else {
        return {
            isLoading,
            error,
            user,
        }
    }

}
