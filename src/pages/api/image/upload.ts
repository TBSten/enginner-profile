import { userFileBucket } from "@/lib/server/userFileBucket";
import { NextApiHandler } from "next";
import { v4 as uuidv4 } from "uuid";

const handler: NextApiHandler = async (req, res) => {

    // 署名つきURLのリクエスト
    const file = userFileBucket.file(`${uuidv4()}`)
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
