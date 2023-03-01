import { themeTypes } from "@/types"
import { ComponentType } from "react"
import BadProfView from "./bad/components"
import BasicProfView from "./basic/components"
import FilesProfView from "./files/components"
import { ProfViewComponentProps } from "./type"

type ThemeTypeUnion = (typeof themeTypes)[number]

const themeTypeAndComponentMap: {
    [key in ThemeTypeUnion]: ComponentType<ProfViewComponentProps>
} = {
    "bad": BadProfView,
    "basic": BasicProfView,
    "files": FilesProfView,
}

export const themeTypeToComponent = (themeType: string) => {
    if (!(themeType in themeTypeAndComponentMap)) {
        throw new Error(`not found theme type component of ${themeType}`)
    }
    return themeTypeAndComponentMap[themeType as ThemeTypeUnion]
}
