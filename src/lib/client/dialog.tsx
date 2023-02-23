import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { ReactNode, useCallback } from "react";

const dialogContentAtom = atom<null | ReactNode>(null)
const canCloseAtom = atom(false)

export function useGlobalDialog() {
    const setDialogContent = useSetAtom(dialogContentAtom)
    const [canClose, setCanClose] = useAtom(canCloseAtom)
    const showDialog = useCallback((
        content: ReactNode, {
            canClose = true,
        }: { canClose?: boolean } = {},
    ) => {
        setDialogContent(content)
        setCanClose(canClose)
    }, [setCanClose, setDialogContent])
    const hideDialog = useCallback(() => {
        if (!canClose) return
        setDialogContent(null)
    }, [canClose, setDialogContent])
    const resetDialog = useCallback(() => {
        setDialogContent(null)
    }, [setDialogContent])
    return {
        showDialog,
        hideDialog,
        resetDialog,
    } as const
}

import { FC } from "react";

interface GlobalDialogProps {
}
const GlobalDialog: FC<GlobalDialogProps> = () => {
    const content = useAtomValue(dialogContentAtom)
    const canClose = useAtomValue(canCloseAtom)
    const { hideDialog } = useGlobalDialog()
    const open = !!content
    return (
        <Dialog open={open} onClose={hideDialog}>
            <DialogContent>
                {content}
            </DialogContent>
            {canClose &&
                <DialogActions>
                    <Button variant="text" onClick={hideDialog}>
                        閉じる
                    </Button>
                </DialogActions>
            }
        </Dialog>
    );
}

export default GlobalDialog;