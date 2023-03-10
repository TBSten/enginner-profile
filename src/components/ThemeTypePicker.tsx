import { ThemeType } from "@/types";
import { Box, Button, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import Image from "next/image";
import { FC, ReactNode, useState } from "react";
import Center from "./Center";
import SelectableBox from "./SelectableBox";
import UtilDialog from "./UtilDialog";

interface ThemeTypePickerProps {
    type: ThemeType
    onChange: (type: ThemeType) => void
    label?: ReactNode
}
const ThemeTypePicker: FC<ThemeTypePickerProps> = ({
    type, onChange, label = "テーマを選択"
}) => {
    const [openThemeDialog, setOpenThemeDialog] = useState(false)
    return (
        <>
            <Box sx={{ cursor: "pointer" }} onClick={() => setOpenThemeDialog(true)} maxWidth={450}>
                {type === "basic" &&
                    <BasicTypeImage />
                }
                {type === "bad" &&
                    <BadTypeImage />
                }
                {type === "files" &&
                    <FileTypeImage />
                }
                <Center>
                    テーマを選択
                </Center>
            </Box>
            <UtilDialog open={openThemeDialog} onClose={() => setOpenThemeDialog(false)}>
                <DialogTitle>
                    {label}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={6}>
                            <SelectableBox
                                select={type === "basic"}
                                onSelect={() => onChange("basic")}
                                onUnselect={() => onChange("basic")}
                            >
                                <BasicTypeImage />
                            </SelectableBox>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <SelectableBox
                                select={type === "bad"}
                                onSelect={() => onChange("bad")}
                                onUnselect={() => onChange("bad")}
                            >
                                <BadTypeImage />
                            </SelectableBox>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <SelectableBox
                                select={type === "files"}
                                onSelect={() => onChange("files")}
                                onUnselect={() => onChange("files")}
                            >
                                <FileTypeImage />
                            </SelectableBox>
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant="text" onClick={() => setOpenThemeDialog(false)}>
                        閉じる
                    </Button>
                </DialogActions>
            </UtilDialog>
        </>
    );
}

export default ThemeTypePicker;


interface BasicTypeImageProps {
}
const BasicTypeImage: FC<BasicTypeImageProps> = () => {
    return (
        <Box position="relative">
            <Box
                position="absolute"
                top={0}
                left={0}
                p={0.5}
                color="white"
                bgcolor={t => t.palette.primary.main}
                sx={{
                    borderBottomRightRadius: "10px",
                }}
            >
                ベーシック
            </Box>
            <Image
                src="/theme-type-preview-1.png"
                alt="ベーシックのプレビュー"
                width={300}
                height={200}
                style={{
                    width: "100%",
                    objectFit: "cover"
                }}
            />
        </Box>
    );
}
interface BasicTypeImageProps {
}
const BadTypeImage: FC<BasicTypeImageProps> = () => {
    return (
        <Box position="relative">
            <Box
                position="absolute"
                top={0}
                left={0}
                p={0.5}
                color="white"
                bgcolor={t => t.palette.primary.main}
                sx={{
                    borderBottomRightRadius: "10px",
                }}
            >
                ダサい
            </Box>
            <Image
                src="/theme-type-preview-2.png"
                alt="ダサいのプレビュー"
                width={300}
                height={200}
                style={{
                    width: "100%",
                    objectFit: "cover"
                }}
            />
        </Box>
    );
}
interface FileTypeImageProps {
}
const FileTypeImage: FC<FileTypeImageProps> = () => {
    return (
        <Box position="relative">
            <Box
                position="absolute"
                top={0}
                left={0}
                p={0.5}
                color="white"
                bgcolor={t => t.palette.primary.main}
                sx={{
                    borderBottomRightRadius: "10px",
                }}
            >
                ファイル
            </Box>
            <Image
                src="/theme-type-preview-3.png"
                alt="ファイルのプレビュー"
                width={300}
                height={200}
                style={{
                    width: "100%",
                    objectFit: "cover"
                }}
            />
        </Box>
    );
}
