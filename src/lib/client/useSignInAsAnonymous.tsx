import { signIn } from "next-auth/react"
import { useEffect } from "react"
import { useSession } from "./auth"

export function useSignInAsAnonymous() {
    const { status } = useSession()
    useEffect(() => {
        if (status === "unauthenticated") {
            signIn("anonymous", { redirect: false, })
        }
    }, [status])
}