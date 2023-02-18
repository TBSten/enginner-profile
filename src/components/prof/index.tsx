import { themeTypes } from "@/types"
import { ComponentType } from "react"
import BadProfView from "./bad"
import FashionableProfView from "./fashionable"
import FilesProfView from "./files"
import { ProfViewComponentProps } from "./util"

type ThemeTypeUnion = (typeof themeTypes)[number]

const themeTypeAndComponentMap: {
    [key in ThemeTypeUnion]: ComponentType<ProfViewComponentProps>
} = {
    "bad": BadProfView,
    "fashionable": FashionableProfView,
    "files": FilesProfView,
}

export const themeTypeToComponent = (themeType: string) => {
    if (!(themeType in themeTypeAndComponentMap)) {
        throw new Error(`not found theme type component of ${themeType}`)
    }
    return themeTypeAndComponentMap[themeType as ThemeTypeUnion]
}
