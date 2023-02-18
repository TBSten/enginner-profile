
export const saveLocal = (key: string, value: unknown) => {
    localStorage.setItem(key, JSON.stringify(value))
}
export const getLocal = (key: string): unknown | null => {
    const data = localStorage.getItem(key)
    if (!data) {
        return null
    }
    const value = JSON.parse(data)
    return value
}
