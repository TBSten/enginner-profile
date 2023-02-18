import { Box, BoxProps, Container } from "@mui/material";
import { FC, ReactNode } from "react";

interface LayoutContentProps extends BoxProps {
    children: ReactNode
    bgcolor?: string
}
const LayoutContent: FC<LayoutContentProps> = ({ children, bgcolor, sx, ...boxProps }) => {
    if (!bgcolor) bgcolor = undefined
    return (
        <Box component="section" bgcolor={bgcolor} p={{ xs: 1, md: 2 }} sx={{ overflowX: "auto", ...sx }} {...boxProps}>
            <Container>
                {children}
            </Container>
        </Box>
    );
}

export default LayoutContent;
