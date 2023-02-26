import { themeTypes } from "@/types"
import { ComponentType } from "react"
import BadProfView from "./bad"
import BasicProfView from "./basic"
import FilesProfView from "./files"
import { ProfViewComponentProps } from "./util"

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
