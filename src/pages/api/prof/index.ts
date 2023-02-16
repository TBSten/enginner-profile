import { addNewProf } from "@/lib/server/prof";
import { NextApiHandler } from "next";
import { z } from "zod";

const handler: NextApiHandler = async (req, res) => {
    if (req.method === "POST") {
        // new Prof
        const body = JSON.parse(req.body)
        const name = z.string().parse(body?.name)
        const newProf = await addNewProf({ name })
        return res.json(newProf)
    }
    res.status(405).json({ "msg": `invalid method ${req.method}` })
}
export default handler;
