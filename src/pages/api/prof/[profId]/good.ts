import { apiRoute } from "@/lib/server/apiRoute";
import { cancelToProf, goodToProf } from "@/lib/server/prof/good";

export default apiRoute({
    onPost: async ({ query, session, res }) => {
        const profId = query.profId
        const sessionUserId = session?.user.userId
        if (!sessionUserId) return res.status(401).json({ msg: `invalid session user id : ${sessionUserId}` })
        await goodToProf(profId, sessionUserId)
        return res.json({ msg: "ok" })
    },
    onDelete: async ({ query, session, res }) => {
        const profId = query.profId
        const sessionUserId = session?.user.userId
        if (!sessionUserId) return res.status(401).json({ msg: `invalid session user id : ${sessionUserId}` })
        await cancelToProf(profId, sessionUserId)
        return res.json({ msg: "ok" })
    },
})
