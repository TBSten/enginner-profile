import { useSession } from "@/lib/client/auth";
import { useUser } from "@/lib/client/user";
import { AppBar, Button, CircularProgress, Divider, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC, useRef, useState } from "react";

interface BaseHeaderProps {
}
const BaseHeader: FC<BaseHeaderProps> = () => {
    const { status, session } = useSession()
    return (
        <AppBar color="inherit" position="sticky" elevation={1}>
            <Toolbar>
                <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
                    えんぷろ
                </Typography>
                {status === "loading" && <CircularProgress />}
                {status === "authenticated" && session?.user
                    ? <UserIcon userId={session!.user.userId} />
                    : <Button href="/login">ログイン</Button>
                }
            </Toolbar>
        </AppBar>
    );
}

export default BaseHeader;

interface UserIconProps {
    userId: string
}
const UserIcon: FC<UserIconProps> = ({ userId }) => {
    const { user } = useUser(userId)
    const [open, setOpen] = useState(false)
    const anchorRef = useRef<HTMLButtonElement>(null)
    const router = useRouter()
    const gotoUserTop = () => {
        router.push(`/user/${userId}`)
    }
    const handleLogout = () => {
        signOut()
    }
    if (!user) {
        return <></>
    }
    return (
        <>
            <IconButton ref={anchorRef} onClick={() => setOpen(true)}>
                <Image
                    src={user.icon}
                    alt={user.name}
                    width={40}
                    height={40}
                    style={{
                        width: "auto",
                        height: "100%",
                        aspectRatio: "1 / 1",
                        borderRadius: "100%",
                    }}
                />
            </IconButton>
            <Menu
                anchorEl={anchorRef.current}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                open={open}
                onClose={() => setOpen(false)}
            >
                <MenuItem onClick={gotoUserTop}>
                    ユーザページへ
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    ログアウト
                </MenuItem>
            </Menu>
        </>
    );
}
