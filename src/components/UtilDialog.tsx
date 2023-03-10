import { useResponsive } from "@/lib/client/responsive";
import { Box, Dialog, DialogProps, Drawer, DrawerProps } from "@mui/material";
import { FC, ReactNode, useState } from "react";

export interface UtilDialogProps {
    open: boolean
    onClose: () => void
    children: ReactNode
    dialogProps?: Partial<DialogProps>
    drawerProps?: Partial<DrawerProps>
}
const UtilDialog: FC<UtilDialogProps> = ({
    open, onClose,
    children,
    dialogProps = {}, drawerProps = {},
}) => {
    const { isPc } = useResponsive()
    if (isPc) {
        return (
            <Dialog {...{ open, onClose }} {...dialogProps}>
                {children}
            </Dialog>
        );
    } else {
        return (
            <Drawer {...{ open, onClose }} anchor="bottom" {...drawerProps}>
                <Box maxHeight="80vh" overflow="auto">
                    {children}
                </Box>
            </Drawer>
        );

    }
}

export default UtilDialog;

export function useUtilDialog(defaultOpen: boolean = false) {
    const [open, setOpen] = useState(defaultOpen)
    const show = () => setOpen(true)
    const hide = () => setOpen(false)
    const toggle = () => setOpen(p => !p)
    const withHide = (callback: () => void) => () => {
        hide()
        callback()
    }
    return {
        open,
        show,
        hide,
        toggle,
        withHide,
        dialogProps: {
            open,
            onClose: hide,
        },
    } as const
}
