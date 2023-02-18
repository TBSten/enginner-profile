import BaseLayout from '@/components/layout/BaseLayout';
import LayoutContent from '@/components/layout/LayoutContent';
import { themeTypeToComponent } from '@/components/prof';
import { getProf } from '@/lib/server/prof';
import { Prof } from '@/types';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { FC } from 'react';

interface Props {
    prof: Prof
}
const ProfViewPage: NextPage<Props> = ({ prof }) => {
    const ProfViewComponent = themeTypeToComponent(prof.theme.type)
    return (
        <>
            <ProfViewHead prof={prof} />
            <BaseLayout>
                <LayoutContent>
                    <ProfViewComponent
                        prof={prof}
                    />
                </LayoutContent>
            </BaseLayout>
        </>
    );
}
export default ProfViewPage;

interface ProfViewHeadProps {
    prof: Prof
}
const ProfViewHead: FC<ProfViewHeadProps> = ({ prof }) => {
    return (
        <Head>
            <title>{prof.name}のプロフィール</title>
        </Head>
    );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const profId = ctx.query.profId as string
    const prof = await getProf(profId)
    if (!prof) {
        return { notFound: true }
    }
    return {
        props: {
            prof,
        }
    }
}