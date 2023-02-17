import { Box, Container } from "@mui/material";
import { FC, ReactNode } from "react";

interface LayoutContentProps {
    children: ReactNode
    bgcolor?: string
}
const LayoutContent: FC<LayoutContentProps> = ({ children, bgcolor }) => {
    if (!bgcolor) bgcolor = undefined
    return (
        <Box component="section" bgcolor={bgcolor} p={2} sx={{ overflowX: "auto" }}>
            <Container>
                {children}
            </Container>
        </Box>
    );
}

export default LayoutContent;
