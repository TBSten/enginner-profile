import { GetServerSideProps, NextPage } from 'next';

interface Props {
}
const Test: NextPage<Props> = ({ }) => {
    return (
        <>test page</>
    );
}
export default Test;

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const ok = Math.random() >= 0.5
    if (ok)
        return {
            props: {}
        }
    else
        throw new Error("for debug error")
}