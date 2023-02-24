import { z } from "zod"
import { db } from "../firestore"
import { randomString } from "../random"

export const tokens = db.collection("tokens")
export const createUserToken = async (userId: string) => {
    const token = randomString(512)
    await tokens.doc(token).set({ userId })
    return token
}
export const tokenToUserId = async (token: string) => {
    const snapshot = await tokens.doc(token).get()
    return z.string().parse(snapshot.data()?.userId)
}
