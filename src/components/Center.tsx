import { Box, BoxProps } from "@mui/material";
import { FC } from "react";

interface CenterProps extends BoxProps {
}
const Center: FC<CenterProps> = ({ sx, ...boxProps }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                ...sx,
            }}
            {...boxProps}
        />
    );
}

export default Center;