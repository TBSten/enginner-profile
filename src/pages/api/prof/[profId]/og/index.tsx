import { theme as muiTheme } from "@/styles/theme";
import { ProfSchema } from "@/types";
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { CSSProperties } from "react";

export const config = {
    runtime: 'experimental-edge',
};

const width = 1200
const height = 630
const fontSizeBase = Math.min(width / 15, height / 4)
const fontSize = {
    sm: fontSizeBase * 0.5,
    md: fontSizeBase,
    lg: fontSizeBase * 2,
}

export default async function handler(req: NextRequest) {
    const { origin, searchParams } = new URL(req.url);
    const profId = searchParams.get("profId")
    if (!profId) throw new Error("profId is null")
    const prof = await fetchProf(origin, profId)
    const freeSpaceMaxLength = 15 * 2 * 2
    const freeSpace = prof.freeSpace.length >= freeSpaceMaxLength
        ? prof.freeSpace.slice(0, freeSpaceMaxLength - 1) + "..."
        : prof.freeSpace

    return new ImageResponse(
        (
            <div style={{
                fontSize: fontSize.md,
                ...center,
                justifyContent: "space-between",
                ...full,
                background: prof.theme.color,
                color: muiTheme.palette.getContrastText(prof.theme.color),
                padding: fontSize.md,
            }}>
                <div style={{
                    ...center,
                    ...full,
                    background: "rgba(255,255,255,0.95)",
                    color: "black",
                    borderRadius: fontSize.sm,
                    padding: fontSize.sm,
                }}>
                    <div style={{
                        ...center,
                        width: "100%",
                        fontSize: fontSize.lg,
                        fontWeight: "bold",
                    }}>
                        {prof.name}
                    </div>
                    <div style={{
                        ...center,
                        width: "100%",
                        fontSize: fontSize.sm,
                    }}>
                        {freeSpace}
                    </div>
                </div>
            </div>
        ),
        {
            width,
            height,
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

// utility properties
const center: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
}
const full: CSSProperties = {
    width: "100%",
    height: "100%",
    flexGrow: 1,
}


