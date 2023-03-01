import { CanvasRenderingContext2D, Image } from "canvas"

export const splitLines = (
    con: CanvasRenderingContext2D,
    text: string,
    width: number,
) => {
    // x,y,w,hに収まるようにテキストを表示 (必要に応じて改行)
    con.textBaseline = "top"
    con.textAlign = "start"

    // con.fillText(text, x, y,)
    const chars = [...text]
    const lines: string[] = [""]
    let current = 0
    let wx = 0
    for (let char of chars) {
        const mt = con.measureText(char)
        if (char === "\n" || wx + mt.width >= width) {
            // 改行
            const newLine: string = char
            lines.push(newLine)
            current++
            wx = mt.width
        } else {
            lines[current] += char
            wx += mt.width
        }
    }
    return lines
}

export const drawImageCover = (
    con: CanvasRenderingContext2D,
    image: Image,
    dx: number,
    dy: number,
    dw: number,
    dh: number,
) => {
    const sw = image.width
    const sh = image.height
    let sClipX: number;
    let sClipY: number;
    let sClipWidth: number;
    let sClipHeight: number;
    if (dw >= dh) {
        // 横長
        // dw : dh = width : sh
        // width = sh * dw /dh
        sClipWidth = dw * sh / dh
        sClipHeight = sh
        sClipX = sw / 2 - sClipWidth / 2
        sClipY = 0
    } else {
        // 縦長
        // sClipWidth = sw
        // sClipHeight = sw * dh / dw
        throw new Error("not implement")
    }
    con.drawImage(image, sClipX, sClipY, sClipWidth, sClipHeight, dx, dy, dw, dh)
}
