import { useMediaQuery } from "@mui/material";
import { useCallback } from "react";

export function useResponsive() {
    const isPc = useMediaQuery('(min-width:600px)');
    const responsive = useCallback(<R,>(onPc: R, onSp: R) => isPc ? onPc : onSp, [isPc])
    return {
        isPc,
        isSp: !isPc,
        responsive,
    } as const
}