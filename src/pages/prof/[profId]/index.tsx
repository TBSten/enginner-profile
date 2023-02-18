import BaseLayout from '@/components/layout/BaseLayout';
import LayoutContent from '@/components/layout/LayoutContent';
import { NextPage } from 'next';

interface Props {
}
const ProfViewPage: NextPage<Props> = ({ }) => {
    return (
        <>
            <BaseLayout>
                <LayoutContent>
                    Overview
                </LayoutContent>
            </BaseLayout>
        </>
    );
}
export default ProfViewPage;
