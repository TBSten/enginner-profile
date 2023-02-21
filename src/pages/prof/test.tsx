import Center from '@/components/Center';
import { db } from '@/lib/server/firestore';
import { Box, Stack, Switch, TextField, Tooltip } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';

interface Props {
    log: unknown
}
const Test: NextPage<Props> = ({ log }) => {
    console.log(log)
    return (
        <>
            <h1>テストページ</h1>
            <div>
                <Box></Box>
                <Stack></Stack>
                <Center></Center>
                <Tooltip title="test">
                    <TextField></TextField>
                </Tooltip>
                <Switch />
                {JSON.stringify(log, null, 3)}
            </div>
        </>
    );
}
export default Test;

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const doc = await db.collection("test").add({ at: new Date() })
    const log = await doc.get()
    return {
        props: {
            log: log.data(),
        },
    }
}