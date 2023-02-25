import { z } from "zod"

const UploadUrlResSchema = z.object({
    publicUrl: z.string(),
    uploadUrl: z.string(),
})

export const upload = async (file: File) => {
    const res = await fetch(`/api/image/upload`).then(r => r.json())
    const { uploadUrl, publicUrl } = UploadUrlResSchema.parse(res)
    await fetch(uploadUrl, {
        method: "PUT",
        body: file,
    })
    return {
        uploadUrl,
        publicUrl,
    } as const
}