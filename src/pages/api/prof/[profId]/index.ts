import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
    if (req.method === "PUT") {
        return res.json({ msg: "ok" })
    }
    res.status(405).json({ msg: `invalid method ${req.method}` })
}
export default handler;
