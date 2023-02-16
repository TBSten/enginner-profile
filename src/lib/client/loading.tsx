import { useState } from "react";

export function useLoading() {
    const [isLoading, setIsLoading] = useState(false)
    const withLoading = <F extends ((...a: any[]) => Promise<any>),>(callback: F) => {
        setIsLoading(true)
        callback().then(() => {
            setIsLoading(false)
        })
    }
    return [isLoading, withLoading] as const
}