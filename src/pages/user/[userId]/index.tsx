import Center from '@/components/Center';
import Left from '@/components/Left';
import BaseLayout from '@/components/layout/BaseLayout';
import LayoutContent from '@/components/layout/LayoutContent';
import { useSession } from '@/lib/client/auth';
import { copyToClipboard } from '@/lib/client/copy';
import { useResponsive } from '@/lib/client/responsive';
import { getProfsByUser } from '@/lib/server/prof';
import { getUser } from '@/lib/server/user';
import { Prof, User } from '@/types';
import { Add, MoreVert } from '@mui/icons-material';
import { Box, Button, Card, CardActionArea, Divider, Grid, IconButton, Menu, MenuItem, Snackbar, Stack } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useRef, useState } from 'react';

interface Props {
    user: User
    profs: Prof[]
}
const UserProfilePage: NextPage<Props> = ({ user, profs }) => {
    const gridItemProps = {
        xs: 6,
        sm: 4,
        md: 3,
        lg: 2,
    } as const
    const { session } = useSession()
    const isMe = session?.user?.userId === user.userId
    const router = useRouter()
    const gotoEditUser = () => {
        router.push(`/user/${user.userId}/edit`)
    }
    const handleSignOut = () => {
        signOut({ redirect: false })
        router.push(`/login`)
    }
    const [snackbarText, setSnackbarText] = useState<null | string>(null)
    const handleCopyUserUrl = async () => {
        await copyToClipboard(`https://enginner-prof.info/user/${user.userId}`)
        setSnackbarText("コピーしました")
    }
    return (
        <>
            <BaseLayout>
                <LayoutContent bgcolor="background.paper">
                    <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="center" spacing={1} px={4}>
                        <Stack direction={{ xs: "column", md: "row" }} alignItems="center" spacing={2}>
                            <Image
                                src={user.icon}
                                alt={user.name}
                                width={100}
                                height={100}
                                style={{
                                    objectFit: "cover",
                                    borderRadius: "1rem",
                                }}
                            />
                            <Left fontSize="1.5em">
                                {user.name}
                            </Left>
                        </Stack>
                        <Center>
                            <UserMenu
                                isMe={isMe}
                                onEdit={gotoEditUser}
                                onSignOut={handleSignOut}
                                onCopyUserUrl={handleCopyUserUrl}
                            />
                        </Center>
                    </Stack>
                </LayoutContent>
                <Divider />
                <LayoutContent>
                    <Left py={1}>
                        作成したプロフ
                    </Left>
                    <Grid container spacing={1} px={2}>
                        {profs.map(prof =>
                            <Grid item key={prof.profId} {...gridItemProps}>
                                <Card>
                                    <CardActionArea href={`/prof/${prof.profId}`}>
                                        <Image
                                            src={prof.icon}
                                            alt={prof.icon}
                                            width={100}
                                            height={100}
                                            style={{
                                                width: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                        <Center p={1}>
                                            {prof.name}
                                        </Center>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        )}
                        {isMe &&
                            <Grid item {...gridItemProps}>
                                <Button href="/prof/new" sx={{ width: "100%", height: "100%" }}>
                                    <Center>
                                        <Add />
                                        <Box mt={2}>
                                            新しいプロフを作る
                                        </Box>
                                    </Center>
                                </Button>
                            </Grid>
                        }
                    </Grid>
                </LayoutContent>
                <Snackbar
                    open={snackbarText !== null}
                    message={snackbarText}
                />
            </BaseLayout>
        </>
    );
}
export default UserProfilePage;

interface UserMenuProps {
    isMe: boolean
    onEdit: () => void
    onSignOut: () => void
    onCopyUserUrl: () => void
}
const UserMenu: FC<UserMenuProps> = ({
    isMe,
    onEdit,
    onSignOut,
    onCopyUserUrl,
}) => {
    const [openMenu, setOpenMenu] = useState(false)
    const btnRef = useRef<HTMLButtonElement>(null)
    const { isPc } = useResponsive()
    return (
        <>
            {isPc
                ? <IconButton onClick={() => setOpenMenu(true)} ref={btnRef}>
                    <MoreVert />
                </IconButton>
                : <Button variant='outlined' onClick={() => setOpenMenu(true)} ref={btnRef}>
                    メニュー
                </Button>
            }

            <Menu
                open={openMenu}
                onClose={() => setOpenMenu(false)}
                anchorEl={btnRef.current}
            >
                <MenuItem onClick={onCopyUserUrl}>
                    URLをコピー
                </MenuItem>
                {isMe &&
                    <>
                        <MenuItem onClick={onEdit}>
                            編集する
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={onSignOut}>
                            ログアウトする
                        </MenuItem>
                    </>
                }
            </Menu>
        </>
    );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const requestUserId = ctx.query.userId as string
    const user = await getUser(requestUserId)
    if (!user || user.type === "anonymous") {
        return { notFound: true }
    }
    const profs = await getProfsByUser(requestUserId)
    return {
        props: {
            user,
            profs,
        }
    }
}