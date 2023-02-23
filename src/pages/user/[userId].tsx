import BaseLayout from '@/components/layout/BaseLayout';
import LayoutContent from '@/components/layout/LayoutContent';
import { getUser } from '@/lib/server/user';
import { User } from '@/types';
import { GetServerSideProps, NextPage } from 'next';

interface Props {
    user: User
}
const UserProfilePage: NextPage<Props> = ({ user }) => {
    return (
        <>
            <BaseLayout>
                <LayoutContent>
                    {JSON.stringify(user)}
                </LayoutContent>
            </BaseLayout>
        </>
    );
}
export default UserProfilePage;

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const requestUserId = ctx.query.userId as string
    const user = await getUser(requestUserId)
    if (!user) {
        return { notFound: true }
    }
    return {
        props: {
            user,
        }
    }
}