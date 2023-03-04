import { Box, BoxProps } from "@mui/material";
import { FC, ReactNode } from "react";

interface LayoutContentProps extends BoxProps {
    children: ReactNode
    // bgcolor?: string
    disablePadding?: boolean
}
const LayoutContent: FC<LayoutContentProps> = ({ disablePadding, children, sx, ...boxProps }) => {
    return (
        <Box component="section" p={{ xs: disablePadding ? 0 : 1, md: disablePadding ? 0 : 2 }} sx={{ overflowX: "auto", boxSizing: "border-box", ...sx }} {...boxProps}>
            {children}
        </Box>
    );
}

export default LayoutContent;
