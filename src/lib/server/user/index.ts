
import { User, UserSchema } from "@/types";
import { db } from "../firestore";

export const users = db.collection("users")

export const addUserIfNotExists = async (user: User) => {
    await users.doc(user.userId).set(user, { merge: false })
}
export const getUser = async (userId: string): Promise<User | null> => {
    const snapshot = await users.doc(userId).get()
    if (!snapshot.exists) return null
    const user = UserSchema.parse(snapshot.data())
    return user
}
