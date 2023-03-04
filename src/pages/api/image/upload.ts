import { userFileBucket } from "@/lib/server/userFileBucket";
import { NextApiHandler } from "next";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from "uuid";
import { authOptions } from "../auth/[...nextauth]";

const handler: NextApiHandler = async (req, res) => {

    // 署名つきURLのリクエスト
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json("please login or login as anonymous")
    const fileName = uuidv4()
    const file = userFileBucket.file(`${session.user.userId}/${fileName}`)
    const publicUrl = file.publicUrl()
    const [uploadUrl] = await file.getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 5 * 60 * 1000,
    })
    res.json({
        publicUrl,
        uploadUrl,
    })
}
export default handler;
