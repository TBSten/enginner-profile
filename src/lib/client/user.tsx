import { UserSchema } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useUser(userId: string | null) {
    const { isLoading, error, data: user } = useQuery({
        queryKey: ["user", userId],
        queryFn: () =>
            userId
                ? fetch(`/api/user/${userId}`)
                    .then(r => r.json())
                    .then(r => {
                        const user = UserSchema.safeParse(r)
                        if (user.success) console.error("invalid response", r,)
                        return user.success ? user.data : null
                    })
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
