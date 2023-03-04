import { Notification, NotificationSchema } from "@/types";
import { getUser, users } from ".";

export const notifications = (userId: string) => users.doc(userId).collection("notifications")

export const getAllNotifications = async (userId: string, { viewUser = true }: { viewUser?: boolean } = {}) => {
    const snapshot = await notifications(userId)
        .orderBy("createAt")
        .get()
    const results = snapshot.docs.map(doc =>
        NotificationSchema.parse(doc.data())
    )
    if (viewUser) {
        await users.doc(userId).set({
            lastNotificationViewed: Date.now(),
        }, { merge: true })
    }
    return results
}
export const getNotViewedNotions = async (userId: string) => {
    const user = await getUser(userId)
    if (!user) throw new Error(`invalid userId : ${userId}`)
    if (user.type === "anonymous") throw new Error(`anonymous user (not login user) can not has notifications . please login`)
    const lastNotificationViewed = user?.lastNotificationViewed
    const snapshot = await notifications(userId)
        .where("createAt", ">=", lastNotificationViewed)
        .orderBy("createAt")
        .get()
    return snapshot.docs.map(doc =>
        NotificationSchema.parse(doc.data()),
    )
}
export const hasNotifications = async (userId: string) => {
    const user = await getUser(userId)
    if (!user) throw new Error(`invalid userId : ${userId}`)
    const snapshot = await notifications(userId)
        .where("createAt", ">=", user.lastNotificationViewed)
        .count().get()
    const { count } = snapshot.data()
    return count >= 1
}
export const addNotification = async (
    targetUserId: string,
    notification: Notification,
) => {
    await notifications(targetUserId).add(notification)
}
