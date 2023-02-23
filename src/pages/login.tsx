import Center from '@/components/Center';
import BaseLayout from '@/components/layout/BaseLayout';
import LayoutContent from '@/components/layout/LayoutContent';
import { Button } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import { getServerSession } from 'next-auth';
import { signIn } from 'next-auth/react';
import { authOptions } from './api/auth/[...nextauth]';

interface Props {
}
const LoginPage: NextPage<Props> = ({ }) => {
    const handleSignIn = () => {
        signIn("google")
    }
    return (
        <BaseLayout>
            <LayoutContent>
                <Center>
                    <Button variant='contained' onClick={handleSignIn}>
                        ログインする
                    </Button>
                </Center>
            </LayoutContent>
        </BaseLayout>
    );
}
export default LoginPage;

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        // ログインしているならユーザページへ
        const userId = session.user.userId
        return {
            redirect: {
                destination: `/user/${userId}`,
                permanent: false,
            }
        }
    }
    return {
        props: {}
    }
}