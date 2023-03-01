import { apiRoute } from "@/lib/server/apiRoute";
import { getUser, updateUser } from "@/lib/server/user";
import { UserSchema } from "@/types";

export default apiRoute({
    onGet: async ({ query, res }) => {
        const user = await getUser(query.userId)
        return res.json(user)
    },
    onPut: async ({ body, query, res, session }) => {
        const userId = query.userId

        // 権限チェック
        const hasUpdateUserPermissions = userId === session?.user.userId
        if (!hasUpdateUserPermissions) {
            return res.status(403).json({
                msg: "you not have permissions to update this user",
            })
        }

        // 入力のチェック
        const userInput = await UserSchema.partial().safeParse(body)
        if (!userInput.success) {
            return res.status(400).json({
                msg: "request body is invalid .",
            })
        }
        const result = await updateUser(userId, userInput.data)
        return res.json(result)
    },
})

