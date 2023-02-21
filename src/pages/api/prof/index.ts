import { addNewProf, addProfFromTemplate } from "@/lib/server/prof";
import { ProfSchema } from "@/types";
import { NextApiHandler } from "next";
import { z } from "zod";

const InputSchema = ProfSchema.extend({
    templateProfId: z.string(),
}).partial()

const handler: NextApiHandler = async (req, res) => {
    if (req.method === "POST") {
        // new Prof
        const body = JSON.parse(req.body)
        const profInput = InputSchema.parse(body)
        if (profInput.templateProfId) {
            // テンプレートありで追加
            const { templateProfId, ...otherInputs } = profInput
            const newProf = await addProfFromTemplate(templateProfId, otherInputs)
            return res.json(newProf)
        } else {
            const newProf = await addNewProf(profInput)
            return res.json(newProf)
        }
    }
    res.status(405).json({ "msg": `invalid method ${req.method}` })
}
export default handler;
