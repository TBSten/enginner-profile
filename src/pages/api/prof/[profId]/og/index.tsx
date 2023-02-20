import { ProfItem, ProfSchema } from "@/types";
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { CSSProperties } from "react";

export const config = {
    runtime: 'edge',
};

const width = 1200
const height = 630
const fontSize = {
    sm: Math.min(width / 30, height / 10),
    md: Math.min(width / 15, height / 4),
    lg: Math.min(width / 10, height / 2),
}
const maxLength = {
    name: 9,
    skillAndProfItem: 17 * 6,
}

export default async function handler(req: NextRequest) {
    const { origin, searchParams } = new URL(req.url);
    const profId = searchParams.get("profId")
    if (!profId) throw new Error("profId is null")

    const prof = await fetchProf(origin, profId)
    const name = slice(prof.name, maxLength.name)
    const mainColor = prof.theme.color
    const skills = prof.skills
        .filter(sk => sk.appeal)
        .slice(0, 5)
        .map(sk => sk.name)
    const profItems = prof.profItems
        .filter((pItem): pItem is ProfItem & { value: { type: "text" } } => pItem.appeal && pItem.value.type === "text")
        .slice(0, 5)
        .map(pItem => pItem.value.text)

    return new ImageResponse(
        (
            <div style={{
                ...center,
                ...fill,
                fontSize: fontSize.md,
                lineHeight: 0.8,
                background: `linear-gradient(45deg, ${mainColor} 30%, #ececec 100%)`,
                padding: fontSize.sm,
            }}>
                <div style={{
                    ...fill,
                    ...flex("column"),
                    alignItems: "center",
                    background: "rgba(255, 255, 255, 0.85)",
                    padding: fontSize.sm * 0.5,
                    borderRadius: fontSize.sm,
                }}>
                    <div style={{
                        ...center,
                        width: "100%",
                        fontWeight: "bold",
                        fontSize: fontSize.lg,
                        height: fontSize.lg,
                        flexShrink: 0,
                    }}>
                        {name}
                    </div>
                    <div style={{
                        ...flex("row"),
                        width: "100%",
                        flexGrow: 1,
                    }}>
                        <div style={{
                            ...center,
                            height: "100%",
                            padding: fontSize.sm,
                        }}>
                            <img
                                src={prof.icon}
                                style={{
                                    width: Math.min(width * 0.25, height * 0.6),
                                    height: Math.min(width * 0.25, height * 0.6),
                                    objectFit: "cover",
                                    borderRadius: fontSize.sm,
                                }}
                            />
                        </div>
                        <div style={{
                            ...flex("row", { flexWrap: "wrap" }),
                            textAlign: "left",
                            flexGrow: 1,
                            flexShrink: 1,
                            width: "100%",
                            fontSize: fontSize.sm,
                            wordBreak: "break-all",
                            paddingTop: fontSize.md * 0.2,
                            lineHeight: 1.2,
                        }}>
                            {/* スキル一覧 */}
                            {slice([...skills, ...profItems].join(" "), maxLength.skillAndProfItem)}
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            width,
            height,
            // debug: true,
        }
    )
}

const fetchProf = async (origin: string, profId: string) => {
    const fetchUrl = new URL(origin)
    fetchUrl.pathname = `/api/prof/${profId}`
    const res = await fetch(fetchUrl).then(r => r.json())
    const prof = ProfSchema.parse(res)
    return prof
}

const slice = (text: string, maxLen: number, ellipse = "...") => {
    return (
        text.length >= maxLen
            ? text.slice(0, maxLen - 1) + ellipse
            : text
    )
}

// utility properties
const center: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
}
const fill: CSSProperties = {
    width: "100%",
    height: "100%",
    flexGrow: 1,
}
const flex = (
    flexDirection: CSSProperties["flexDirection"] = "column",
    {
        flexWrap = "nowrap",
    }: {
        flexWrap?: CSSProperties["flexWrap"]
    } = {}
): CSSProperties => ({
    display: "flex",
    flexDirection,
    flexWrap,
})

