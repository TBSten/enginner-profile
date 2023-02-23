import { apiRoute } from "@/lib/server/apiRoute";
import { getUser } from "@/lib/server/user";

export default apiRoute({
    onGet: async ({ query, res }) => {
        const user = await getUser(query.userId)
        return res.json(user)
    },
})
