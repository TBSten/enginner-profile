import Center from '@/components/Center';
import UtilDialog, { useUtilDialog } from '@/components/UtilDialog';
import BaseLayout from '@/components/layout/BaseLayout';
import LayoutContent from '@/components/layout/LayoutContent';
import { chooseFile } from '@/lib/client/file';
import { useLoading } from '@/lib/client/loading';
import { useSavable } from '@/lib/client/savable';
import { upload } from '@/lib/client/upload';
import { getUser } from '@/lib/server/user';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { User } from '@/types';
import { Box, Button, CircularProgress, DialogActions, DialogContent, Divider, FormLabel, Grid, Stack, TextField, Typography } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import { getServerSession } from 'next-auth';
import Image from "next/image";
import { useRouter } from 'next/router';
import { FC } from 'react';

interface Props {
    user: User
}
const UserEditPage: NextPage<Props> = ({ user: defaultUser, }) => {
    const [user, setUser, { handleSave: handleSaveUser, hasNotSaved }] = useSavable(defaultUser)
    const handleSave = handleSaveUser(async () => {
        await fetch(`/api/user/${user.userId}`, {
            method: "PUT",
            body: JSON.stringify(user),
        }).then(r => r.json())
        closeConfirmDialog.hide()
    })

    const userTopUrl = `/user/${user.userId}`
    const closeConfirmDialog = useUtilDialog()
    const router = useRouter()
    const handleGotoUserTop = () => {
        if (hasNotSaved()) {
            return closeConfirmDialog.show()
        }
        router.push(userTopUrl)
    }

    return (
        <BaseLayout>
            <LayoutContent bgcolor="background.paper">
                <Typography variant="h6" component="h1">
                    ユーザ情報の変更
                </Typography>
            </LayoutContent>
            <Divider />
            <Box width={1} height="16px" />
            <LayoutContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm="auto">
                        <IconUploader
                            name={user.name}
                            icon={user.icon}
                            onChange={icon => setUser(p => ({ ...p, icon }))}
                        />
                    </Grid>
                    <Grid item xs>
                        <FormLabel>ユーザ名</FormLabel>
                        <TextField variant='outlined'
                            value={user.name}
                            onChange={e => setUser(p => ({ ...p, name: e.target.value }))}
                            fullWidth
                            sx={{ fontSize: "1.5em" }}
                        />
                    </Grid>
                </Grid>
            </LayoutContent>
            <LayoutContent>
                <Stack direction="row" alignItems="center" justifyContent={{ xs: "center", sm: "flex-end" }}>
                    <Button variant='contained' onClick={handleSave}>
                        保存
                    </Button>
                    <Button variant='text' onClick={handleGotoUserTop}>
                        閉じる
                    </Button>
                    <UtilDialog {...closeConfirmDialog.dialogProps}>
                        <DialogContent>
                            保存されていない内容があります。保存しますか？
                        </DialogContent>
                        <DialogActions>
                            <Button variant='contained' onClick={handleSave}>
                                保存する
                            </Button>
                            <Button variant='text' href={userTopUrl}>
                                保存せずに移動する
                            </Button>
                        </DialogActions>
                    </UtilDialog>
                </Stack>
            </LayoutContent>
        </BaseLayout>
    );
}
export default UserEditPage;

interface IconUploaderProps {
    name: string
    icon: string
    onChange: (icon: string) => void
}
const IconUploader: FC<IconUploaderProps> = ({
    name,
    icon, onChange,
}) => {
    const [isUploadingIcon, withUpload] = useLoading()
    const handleUploadIcon = async () => {
        const file = await chooseFile("image/*")
        await withUpload(async () => {
            const { publicUrl } = await upload(file)
            onChange(publicUrl)
        })
    }
    const iconSize = 100
    return (
        <Stack direction="column" alignItems="center" onClick={handleUploadIcon} width="fit-content">
            <Box borderRadius={2} overflow="hidden" width={iconSize} height={iconSize}>
                <Box position="relative">
                    {isUploadingIcon &&
                        <Center position="absolute" left={0} top={0} width="100%" height="100%" bgcolor="rgba(0,0,0,0.5)">
                            <CircularProgress size={iconSize * 0.9} />
                        </Center>
                    }
                    <Image
                        src={icon}
                        alt={name}
                        width={iconSize}
                        height={iconSize}
                        style={{ objectFit: "cover" }}
                    />
                </Box>
            </Box>
            <Box component="span" textAlign="center" width={100} pt={1} fontSize="0.8em">
                画像を <br />
                アップロード
            </Box>
        </Stack>
    );
}


export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const requestUserId = ctx.query.usrId as string
    const session = await getServerSession(ctx.req, ctx.res, authOptions)
    if (!session || requestUserId === session.user.userId) {
        return {
            notFound: true,
        }
    }
    const user = await getUser(session.user.userId)
    if (!user) {
        return {
            notFound: true,
        }
    }
    return {
        props: {
            user,
        }
    }
}
