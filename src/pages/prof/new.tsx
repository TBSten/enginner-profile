import { ProfSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Container, InputBase, Stack } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from "next/router";
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z.object({
    name: z.string().min(3),
})

interface Props {
}
const NewProfPage: NextPage<Props> = ({ }) => {
    const { register, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema)
    })
    const router = useRouter()
    const onNewProf = handleSubmit(async (data) => {
        const res = await fetch(`/api/prof/`, {
            method: "POST",
            body: JSON.stringify(data),
        }).then(r => r.json())
        const newProf = ProfSchema.parse(res)
        router.push(`/prof/${newProf.profId}/edit`)
    })
    return (
        <>
            <Box bgcolor={t => t.palette.grey[200]} width="100%" height="100%">
                <Stack direction="column" justifyContent="center" alignItems="center" sx={{ py: 2 }}
                    component="form" onSubmit={onNewProf}
                >
                    <Container maxWidth="lg">
                        <Box p={2} bgcolor={t => t.palette.background.paper} width="100%">
                            <InputBase
                                fullWidth
                                inputProps={{
                                    placeholder: "名前を入力してください",
                                    style: {
                                        fontSize: "2rem",
                                        textAlign: "center",
                                    },
                                    ...register("name"),
                                }}
                            />
                        </Box>
                    </Container>
                    <Box width="1px" height="5rem" />
                    <Container maxWidth="sm">
                        <Button variant='contained' fullWidth type="submit" disabled={!isValid || isSubmitting}>
                            プロフを作成する
                        </Button>
                    </Container>
                </Stack>
            </Box>
        </>
    );
}
export default NewProfPage;

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    console.error("test error log")
    console.warn("test warn log")
    console.log("test log log")
    console.log("--------------------")
    return {
        props: {}
    }
}