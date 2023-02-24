import { apiRoute } from "@/lib/server/apiRoute";
import { addNewProf, addProfFromTemplate } from "@/lib/server/prof";
import { addAnonymousUser } from "@/lib/server/user";
import { ProfSchema } from "@/types";
import { z } from "zod";

const InputSchema = ProfSchema.extend({
    templateProfId: z.string(),
}).partial()

export default apiRoute({
    onPost: async ({ body, session, res, req }) => {
        const profInput = InputSchema.parse(body)
        let userId = session?.user.userId ?? null
        if (userId === null) {
            const anonymousUser = await addAnonymousUser()
            userId = anonymousUser.userId
            throw new Error("not implement post prof from anonymousUser")
        }
        if (profInput.templateProfId) {
            const { templateProfId, ...otherInputs } = profInput
            const prof = await addProfFromTemplate(templateProfId, otherInputs, userId)
            return res.json(prof)
        } else {
            const prof = await addNewProf(profInput, userId)
            return res.json(prof)
        }
    },
});
