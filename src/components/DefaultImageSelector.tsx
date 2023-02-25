import { Box, Stack } from "@mui/material";
import Image from "next/image";
import { FC } from "react";

const images = [
    "https://storage.googleapis.com/enginner-prof-user-images/defaults/default-1",
    "https://storage.googleapis.com/enginner-prof-user-images/defaults/student-1",
    "https://storage.googleapis.com/enginner-prof-user-images/defaults/front-1",
    "https://storage.googleapis.com/enginner-prof-user-images/defaults/back-1",
    "https://storage.googleapis.com/enginner-prof-user-images/defaults/infra-1",
    "https://storage.googleapis.com/enginner-prof-user-images/defaults/app-1",
]

interface DefaultImageSelectorProps {
    img: string
    onChange: (img: string) => void
}
const DefaultImageSelector: FC<DefaultImageSelectorProps> = ({
    img, onChange,
}) => {
    return (
        <Stack direction="row" spacing={1} width="100%" overflow="auto">
            {images.map(img =>
                <Box key={img} onClick={() => onChange(img)}>
                    <Image
                        src={img}
                        alt="デフォルトの画像"
                        width={100}
                        height={100}
                        style={{ height: "auto" }}
                    />
                </Box>
            )}
        </Stack>
    );
}

export default DefaultImageSelector;