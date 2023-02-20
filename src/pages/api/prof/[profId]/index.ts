import { getProf, updateProf } from "@/lib/server/prof";
import { ProfSchema } from "@/types";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
    const profId = req.query.profId as string
    if (req.method === "GET") {
        const havePermission = true /* TODO: Permission */
        const prof = await getProf(profId)
        if (!prof?.publish) {
            return res.status(404).json({ msg: "prof not found" })
        }
        if (!havePermission) {
            return res.status(401).json({ msg: "you do not have permission" })
        }
        return res.json(prof)
    } else if (req.method === "PUT") {
        const body = JSON.parse(req.body)
        const input = ProfSchema.partial().parse(body)
        await updateProf(profId, input)
        return res.json({ msg: "ok" })
    }
    res.status(405).json({ msg: `invalid method ${req.method}` })
}
export default handler;
