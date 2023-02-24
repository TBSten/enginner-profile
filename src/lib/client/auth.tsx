import { signIn, useSession as useNextAuthSession } from "next-auth/react"
import { useEffect } from "react"

export function useSession() {
    const session = useNextAuthSession()
    const status = session.status === "unauthenticated" ? "loading" : session.status
    const data = status === "authenticated" ? session.data : null
    useEffect(() => {
        if (session.status === "unauthenticated") {
            signIn("anonymous", { redirect: false, })
        }
    }, [session.status])
    return {
        data: session.data,
        status: session.status,
    }
}
