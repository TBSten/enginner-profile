import { Box, BoxProps } from "@mui/material";
import { FC } from "react";

interface LeftProps extends BoxProps {
}
const Left: FC<LeftProps> = ({ ...boxProps }) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="flex-start"
            textAlign="center"
            {...boxProps}
        />
    );
}

export default Left;