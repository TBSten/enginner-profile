
import { User, UserSchema } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firestore";

export const users = db.collection("users")

export const defaultIcon = "https://storage.googleapis.com/enginner-prof-app-images/default-1.png"

export const addUserIfNotExists = async (user: User) => {
    await users.doc(user.userId).set(user, { merge: false })
}
export const addAnonymousUser = async (): Promise<User> => {
    const userId = uuidv4()
    const user: User = {
        userId,
        icon: defaultIcon,
        type: "anonymous",
        name: userId,
        lastNotificationViewed: 0,
    }
    await users.doc(userId).set(user)
    return user
}
export const getUser = async (userId: string): Promise<User | null> => {
    const snapshot = await users.doc(userId).get()
    if (!snapshot.exists) return null
    const user = UserSchema.parse(snapshot.data())
    return user
}
export const updateUser = async (userId: string, userInput: Partial<User>) => {
    await users.doc(userId).update(userInput)
    return await getUser(userId)
}
