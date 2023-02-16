import { getProf } from '@/lib/server/prof';
import { Prof } from '@/types';
import { GetServerSideProps, NextPage } from 'next';

interface Props {
    prof: Prof
}
const ProfDetailPage: NextPage<Props> = ({ prof }) => {
    return (
        <>
            {JSON.stringify(prof)}
        </>
    );
}
export default ProfDetailPage;


export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const id = ctx.query.profId as string
    const prof = await getProf(id)
    if (prof === null) {
        return { notFound: true }
    }
    return {
        props: {
            prof,
        }
    }
}