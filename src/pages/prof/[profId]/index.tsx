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
    const handleCreateFromProf = () => {
        // profをもとに新しいプロフを新規作成
    }
    return (
        <>
            <ProfViewHead prof={prof} />
            <BaseLayout>
                <LayoutContent>
                    <ProfViewComponent
                        prof={prof}
                        createFromProf={handleCreateFromProf}
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
            <title>{`${prof.name}のプロフィール`}</title>
        </Head>
    );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    // キャッシュを無効化
    ctx.res.setHeader('Cache-Control', 'max-age=0')

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