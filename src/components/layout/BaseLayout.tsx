import { Box } from "@mui/material";
import { FC, ReactNode } from "react";
import BaseHeader from "./BaseHeader";

interface BaseLayoutProps {
    children: ReactNode
}
const BaseLayout: FC<BaseLayoutProps> = ({ children }) => {
    return (
        <Box minWidth="100%" minHeight="100%" bgcolor={t => t.palette.grey[300]}>
            <BaseHeader
            />
            {children}
        </Box>
    );
}

export default BaseLayout;
