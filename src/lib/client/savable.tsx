import { useCallback, useRef, useState } from "react";

export function useSavable<T>(init: T) {
    const [value, set] = useState(init)
    const lastSavedRef = useRef(init)
    const lastSaved = useCallback(() => lastSavedRef.current, [])
    const hasNotSaved = () => lastSaved() === value
    const handleSave = useCallback(<A extends Array<any>, R>(callback: (...args: A) => Promise<R>) =>
        async (...a: A): Promise<R> => {
            const callbackResult = await callback(...a)
            lastSavedRef.current = value
            return callbackResult
        }, [value])
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
