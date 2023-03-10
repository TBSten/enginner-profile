
import { colors } from "@/styles/color";
import { Box, Menu, MenuItem, Stack, useTheme } from "@mui/material";
import { FC, useCallback, useRef, useState } from "react";

interface ColorPickerProps {
    size?: string
    color: string
    onChange: (color: string) => void
    label?: string
}
const ColorPicker: FC<ColorPickerProps> = ({ color, onChange, size = "2.5rem", label = "テーマカラーを選択" }) => {
    const { props: { open, onOpen, onClose } } = useColorPicker()
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
            <Menu open={open} onClose={onClose} anchorEl={boxRef.current} anchorOrigin={{ horizontal: "right", vertical: "center" }} sx={{ maxHeight: "80vh" }}>
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

export function useColorPicker() {
    const [open, setOpen] = useState(false);
    const onOpen = useCallback(() => setOpen(true), [])
    const onClose = useCallback(() => setOpen(false), [])
    const show = onOpen
    const hide = onClose
    const props = {
        open,
        onOpen,
        onClose,
    } as const
    return {
        open,
        show,
        hide,
        props,
    }
}