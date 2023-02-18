import { Box, BoxProps, useTheme } from "@mui/material";
import { FC } from "react";

interface SelectableBoxProps extends BoxProps {
    select: boolean
    onSelect: () => void
    onUnselect: () => void
}
const SelectableBox: FC<SelectableBoxProps> = ({ select, onSelect, onUnselect, children, ...boxProps }) => {
    const theme = useTheme()
    return (
        <Box
            overflow="hidden"
            borderRadius="1rem"
            onClick={() => select ? onUnselect() : onSelect()}
            p={1}
            {...select ? {
                border: `solid 4px ${theme.palette.primary.main}`,
            } : {
                border: "4px",
            }}
            {...boxProps}
        >
            {children}
        </Box>
    );
}

export default SelectableBox;