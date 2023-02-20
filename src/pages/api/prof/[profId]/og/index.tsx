import { theme as muiTheme } from "@/styles/theme";
import { ProfSchema } from "@/types";
import { alpha } from "@mui/material";
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { CSSProperties } from "react";

export const config = {
    runtime: 'experimental-edge',
};

const width = 1200
const height = 630
const fontSize = {
    sm: Math.min(width / 30, height / 10),
    md: Math.min(width / 15, height / 4),
    lg: Math.min(width / 10, height / 2),
}
const maxLength = {
    name: 10,
    freeSpace: 15 * 2 * 2,
}

export default async function handler(req: NextRequest) {
    const { origin, searchParams } = new URL(req.url);
    const profId = searchParams.get("profId")
    if (!profId) throw new Error("profId is null")

    const prof = await fetchProf(origin, profId)
    const name = prof.name.length >= maxLength.name
        ? prof.name.slice(0, maxLength.name - 1) + "..."
        : prof.name
    const freeSpace = prof.freeSpace.length >= maxLength.freeSpace
        ? prof.freeSpace.slice(0, maxLength.freeSpace - 1) + "..."
        : prof.freeSpace

    return new ImageResponse(
        (
            <div style={{
                ...center,
                fontSize: fontSize.md,
                lineHeight: 0.8,
                position: "relative",
                background: muiTheme.palette.getContrastText(prof.theme.color),
            }}>
                {/* background */}
                <img
                    src={prof.icon}
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        ...full,
                        objectFit: "cover",
                    }}
                />
                {/* content */}
                <div style={{
                    ...center,
                    ...full,
                    color: muiTheme.palette.getContrastText(prof.theme.color),
                    padding: fontSize.sm,
                }}>
                    <div style={{
                        ...center,
                        ...full,
                        justifyContent: "space-around",
                        background: alpha(prof.theme.color, 0.95),
                        color: muiTheme.palette.getContrastText(prof.theme.color),
                        borderRadius: fontSize.sm,
                        padding: fontSize.sm,
                    }}>
                        <div style={{
                            ...center,
                            width: "100%",
                            fontSize: fontSize.lg,
                            fontWeight: "bold",
                        }}>
                            {name}
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


