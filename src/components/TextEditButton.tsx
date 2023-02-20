
import { Edit } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, TextField, TextFieldProps } from "@mui/material";
import { FC, ReactNode, useState } from "react";

type TextEditButtonProps = TextFieldProps & {
    icon?: ReactNode
    label: string
    dialogProps?: DialogProps
}
const TextEditButton: FC<TextEditButtonProps> = ({
    icon = <Edit />,
    label,
    dialogProps,
    color,
    ...textFieldProps
}) => {
    const [openDialog, setOpenDialog] = useState(false)
    return (
        <>
            <Button onClick={() => setOpenDialog(true)} startIcon={icon} color={color}>
                {label}
            </Button>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} {...dialogProps} fullWidth>
                <DialogTitle>
                    {label}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        {...textFieldProps}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="text" onClick={() => setOpenDialog(false)}>
                        閉じる
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default TextEditButton;