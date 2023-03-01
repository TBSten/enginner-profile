import { Box, Stack } from "@mui/material";
import Image from "next/image";
import { FC } from "react";

const images = [
    "https://storage.googleapis.com/enginner-prof-app-images/default-1.png",
    "https://storage.googleapis.com/enginner-prof-app-images/student-1.png",
    "https://storage.googleapis.com/enginner-prof-app-images/front-1.png",
    "https://storage.googleapis.com/enginner-prof-app-images/back-1.png",
    "https://storage.googleapis.com/enginner-prof-app-images/infra-1.png",
    "https://storage.googleapis.com/enginner-prof-app-images/app-1.png",
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