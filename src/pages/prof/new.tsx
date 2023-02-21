import { ProfSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Container, Dialog, DialogContent, InputBase, Stack } from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from "next/router";
import { useState } from "react";
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
        setDialogContent("プロフを新規作成中...")
        const res = await fetch(`/api/prof/`, {
            method: "POST",
            body: JSON.stringify(data),
        }).then(r => r.json())
        const newProf = ProfSchema.parse(res)
        setDialogContent("プロフ編集画面に移動中")
        router.push(`/prof/${newProf.profId}/edit`)
    })

    const [dialogContent, setDialogContent] = useState<null | string>(null)
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
            <Dialog open={dialogContent !== null} onClose={() => setDialogContent(null)}>
                <DialogContent>
                    {dialogContent}
                </DialogContent>
            </Dialog>
        </>
    );
}
export default NewProfPage;
