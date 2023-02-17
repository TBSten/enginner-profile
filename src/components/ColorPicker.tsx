
import { Box, Menu, MenuItem, Stack, useTheme } from "@mui/material";
import { FC, useRef } from "react";

export const colors = [
    // 背景透明 文字指定
    ["黒", "#1C1C1C"],
    ["グレー", "#8E8E8E"],
    ["赤", "#C7243A"],
    ["オレンジ", "#DA5019"],
    ["黄", "#efc400"],
    ["緑", "#009250"],
    ["青", "#3261AB"],
    ["紫", "#744199"],
    ["ピンク", "#B61972"],
] as const
export const defaultColor = colors[0]

interface ColorPickerProps {
    size?: string
    open: boolean
    onOpen: () => void
    onClose: () => void
    color: string
    onChange: (color: string) => void
    label?: string
}
const ColorPicker: FC<ColorPickerProps> = ({ color, onChange, open, onOpen, onClose, size = "2.5rem", label = "テーマカラーを選択" }) => {
    const boxRef = useRef<HTMLElement>(null)
    const theme = useTheme()
    const handleSelect = (color: string) => () => {
        onChange(color)
        // onClose()
    }
    return (
        <>
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                flexWrap="wrap"
                textAlign="center"
                onClick={() => onOpen()}
                sx={{ cursor: "pointer" }}
                width="fit-content"
            >
                <Box border="solid 1px" borderColor={color} padding="2px" borderRadius={1}>
                    <Box
                        width={size}
                        height={size}
                        ref={boxRef}
                        bgcolor={color}
                        borderRadius={1}
                    />
                </Box>
                <Box component="span" px={1} color={color}>
                    {label}
                </Box>
            </Stack>
            <Menu open={open} onClose={onClose} anchorEl={boxRef.current} anchorOrigin={{ horizontal: "right", vertical: "center" }}>
                {colors.map(([name, color]) =>
                    <MenuItem key={color} onClick={handleSelect(color)}>
                        <Box
                            component="span"
                            width="1.5rem"
                            height="1.5rem"
                            bgcolor={color}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            color={theme.palette.getContrastText(color)}
                        >{name[0]}</Box>
                        <Box component="span" px={1}>
                            {name}
                        </Box>
                    </MenuItem>
                )}
                <MenuItem color={theme.palette.grey[100]} onClick={onClose}>
                    閉じる
                </MenuItem>
            </Menu>
        </>
    );
}

export default ColorPicker;