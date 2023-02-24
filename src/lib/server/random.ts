import crypto from "crypto"
export const randomString = (len: number = 256): string => {
    const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    return Array.from(crypto.randomFillSync(new Uint8Array(len))).map((n) => S[n % S.length]).join('')
}
