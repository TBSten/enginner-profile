import Center from '@/components/Center';
import SeoHead from '@/components/Seo';
import BaseLayout from '@/components/layout/BaseLayout';
import LayoutContent from '@/components/layout/LayoutContent';
import { getUser } from '@/lib/server/user';
import { Google, Star } from '@mui/icons-material';
import { Button, List, ListItem, ListItemIcon, Typography } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import { getServerSession } from 'next-auth';
import { signIn } from 'next-auth/react';
import Head from 'next/head';
import { FC } from 'react';
import { authOptions } from './api/auth/[...nextauth]';

interface Props {
}
const LoginPage: NextPage<Props> = () => {
    const handleSignIn = () => {
        signIn("google")
    }
    return (
        <BaseLayout>
            <LoginHead />
            <LayoutContent>
                <Center>
                    <Typography variant='h4' component="h1">
                        あなたはログインしていません
                    </Typography>
                </Center>
                <Center borderRadius={1} bgcolor="background.paper" my={2} p={2}>
                    ログインすることで以下のような機能を使用できます。
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <Star />
                            </ListItemIcon>
                            ホゲホゲ機能
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <Star />
                            </ListItemIcon>
                            ホゲホゲ機能
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <Star />
                            </ListItemIcon>
                            ホゲホゲ機能
                        </ListItem>
                    </List>
                </Center>
                <Center>
                    <Button variant='contained' onClick={handleSignIn} startIcon={<Google />}>
                        Googleで
                        ログインする
                    </Button>
                </Center>
            </LayoutContent>
        </BaseLayout>
    );
}
export default LoginPage;

interface LoginHeadProps {
}
const LoginHead: FC<LoginHeadProps> = () => {
    return (
        <Head>
            <SeoHead
                pageTitle="ログイン"
                pageDescription="えんぷろはプログラミングを学ぶ学生やエンジニア向けの手軽な自己紹介を作成するためのサービスです。\nこのページはログインするページです。"
                pageImg="https://enginner-prof.info/enginner-prof-icon.og.png"
                pageImgWidth={500}
                pageImgHeight={500}
            />
            <title>{"ログイン"}</title>
        </Head>);
}


export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions)
    const user = session !== null
        ? await getUser(session.user.userId)
        : null
    // 既にログイン済みならユーザページへ
    if (user !== null && user.type !== "anonymous") {
        const userId = user.userId
        return {
            redirect: {
                destination: `/user/${userId}`,
                permanent: false,
            }
        }
    }
    return {
        props: {
            user,
        }
    }
}