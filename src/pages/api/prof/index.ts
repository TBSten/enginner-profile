import { apiRoute } from "@/lib/server/apiRoute";
import { addNewProf, addProfFromTemplate } from "@/lib/server/prof";
import { ProfSchema } from "@/types";
import { z } from "zod";

const InputSchema = ProfSchema.extend({
    templateProfId: z.string(),
}).partial()

export default apiRoute({
    onPost: async ({ body, session, res }) => {
        const profInput = InputSchema.parse(body)
        const userId = session?.user.userId ?? null
        if (profInput.templateProfId) {
            const { templateProfId, ...otherInputs } = profInput
            const newProf = await addProfFromTemplate(templateProfId, otherInputs, userId)
            return res.json(newProf)
        } else {
            const newProf = await addNewProf(profInput, userId)
            return res.json(newProf)
        }
    },
});
