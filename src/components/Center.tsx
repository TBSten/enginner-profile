import { Box, BoxProps } from "@mui/material";
import { FC } from "react";

interface CenterProps extends BoxProps {
}
const Center: FC<CenterProps> = ({ ...boxProps }) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            {...boxProps}
        />
    );
}

export default Center;