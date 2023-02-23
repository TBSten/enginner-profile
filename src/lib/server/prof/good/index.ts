import { GoodToProf } from "@/types"
import { profs } from ".."

const goods = (profId: string) => profs.doc(profId).collection("goods")

export const goodToProf = async (profId: string, senderId: string) => {
    const good: GoodToProf = {
        profId, senderId,
        createAt: Date.now(),
    }
    await goods(profId).doc(senderId).set(good)
    return good
}
export const cancelToProf = async (profId: string, senderId: string) => {
    await goods(profId).doc(senderId).delete()
}
export const getGoodCount = async (profId: string, senderId: string | null = null) => {
    if (senderId) {
        const snapshot = await goods(profId).doc(senderId).get()
        return snapshot.exists ? 1 : 0
    }
    const { data: count } = await goods(profId).count().get()
    return count
}
