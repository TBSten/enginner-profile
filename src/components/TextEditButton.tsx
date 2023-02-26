
import { Edit } from "@mui/icons-material";
import { Button, DialogActions, DialogContent, DialogTitle, TextField, TextFieldProps } from "@mui/material";
import { FC, ReactNode, useState } from "react";
import UtilDialog, { UtilDialogProps } from "./UtilDialog";

type TextEditButtonProps = TextFieldProps & {
    icon?: ReactNode
    label: string
    dialogProps?: UtilDialogProps
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
            <UtilDialog open={openDialog} onClose={() => setOpenDialog(false)} {...dialogProps} dialogProps={{ fullWidth: true }}>
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
            </UtilDialog>
        </>
    );
}

export default TextEditButton;