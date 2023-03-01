import { apiRoute } from "@/lib/server/apiRoute";
import { drawImageCover, splitLines } from "@/lib/server/canvas";
import { getProf } from "@/lib/server/prof";
import { createCanvas, loadImage, registerFont } from "canvas";
import * as path from "path";


export default apiRoute({
    onGet: async ({ res, query }) => {
        const prof = await getProf(query.profId)
        if (!prof) return res.status(404).json("not found")
        let name = prof.name.length >= 54 ? prof.name.slice(0, 54 - 1) + "..." : prof.name

        const width = 1200
        const height = 640
        const fontSize = Math.min(width / 18, height / 5)
        const NotoSansJpPath = path.join(process.cwd(), "src", "styles", "fonts", "Noto_Sans_JP", "NotoSansJP-Regular.otf")
        registerFont(NotoSansJpPath, {
            family: "Noto Sans JP",
        })
        const canvas = createCanvas(width, height)

        const con = canvas.getContext("2d")
        con.font = `${fontSize}px Noto Sans JP`

        // 背景
        con.fillStyle = prof.theme.color
        con.fillRect(0, 0, width, height)

        // 端の三角
        const edgeSize = width / 10
        con.fillStyle = "white"
        con.beginPath()
        con.moveTo(0, 0)
        con.lineTo(edgeSize, 0)
        con.lineTo(0, edgeSize)
        con.fill()
        con.beginPath()
        con.moveTo(width, height)
        con.lineTo(width - edgeSize, height)
        con.lineTo(width, height - edgeSize)
        con.fill()

        // 文字の設定
        con.textBaseline = "bottom"
        con.textAlign = "end"

        con.fillStyle = "rgba(255,255,255,0.9)"
        con.beginPath()
        con.roundRect(30, 30, width - 30 * 2, height - 30 * 2, fontSize / 3)
        con.fill()

        // アイコンの描画
        const icon = await loadImage(prof.icon)
        const iconSize = height - 120 * 2
        drawImageCover(con, icon, 70, 120, iconSize, iconSize)

        // 名前の描画
        con.fillStyle = "black"
        const imgTextPad = fontSize / 2
        const lines = splitLines(con, name, width - 70 * 2 - iconSize - imgTextPad)
        lines.forEach((line, i) => {
            con.textBaseline = "top"
            con.textAlign = "left"
            con.fillText(line, 70 + iconSize + imgTextPad, 70 + fontSize * i)
        })

        con.fillStyle = "#000a"
        con.textAlign = "end"

        con.font = `${fontSize * 7 / 10}px Noto Sans JP`
        con.fillText("のプロフ", width - 70, 70 + fontSize * lines.length + 40)

        const png = canvas.createPNGStream()
        png.pipe(res)
    },
})

