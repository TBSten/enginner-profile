import { Box, BoxProps } from "@mui/material";
import React from "react";

interface CenterProps extends BoxProps {
}
const Center = React.forwardRef<HTMLDivElement, CenterProps>(function Center({ ...boxProps }, ref) {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            {...boxProps}
            ref={ref}
        />
    );
})

export default Center;