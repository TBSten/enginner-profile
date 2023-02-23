import { Box, BoxProps } from "@mui/material";
import { FC } from "react";

interface RightProps extends BoxProps {
}
const Right: FC<RightProps> = ({ ...boxProps }) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="flex-end"
            textAlign="center"
            {...boxProps}
        />
    );
}

export default Right;