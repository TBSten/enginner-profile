import { useCallback, useState } from "react";

export function useSavable<T>(init: T) {
    const [value, set] = useState(init)
    const [lastSaved, setLastSaved] = useState(init)
    const hasNotSaved = value !== lastSaved
    const handleSave = useCallback(<A extends Array<any>, R>(callback: (...args: A) => R) =>
        async (...a: A): Promise<R> => {
            const callbackResult = await callback(...a)
            setLastSaved(lastSaved)
            return callbackResult
        }, [lastSaved])
    return [
        value,
        set,
        {
            hasNotSaved,
            lastSaved,
            handleSave,
        }
    ] as const
}
