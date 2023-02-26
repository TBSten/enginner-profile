import { useSession } from "@/lib/client/auth";
import { useGlobalDialog } from "@/lib/client/dialog";
import { LOCAL_PROF_KEY, saveLocal } from "@/lib/client/saveLocal";
import { getUser } from "@/lib/server/user";
import { ProfSchema, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Container, InputBase, Stack } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { authOptions } from "../api/auth/[...nextauth]";

const FormSchema = z.object({
    name: z.string().min(3),
})

interface Props {
    user: User | null
}
const NewProfPage: NextPage<Props> = ({ user }) => {
    const { register, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: user?.name ?? "",
        },
    })
    const router = useRouter()
    const onNewProf = handleSubmit(async (data) => {
        showDialog("プロフを新規作成中...", { canClose: false })
        const res = await fetch(`/api/prof/`, {
            method: "POST",
            body: JSON.stringify(data),
        }).then(r => r.json())
        const newProf = ProfSchema.parse(res)
        saveLocal(LOCAL_PROF_KEY, newProf)
        showDialog("プロフ編集画面に移動中", { canClose: false })
        router.push(`/prof/${newProf.profId}/edit`)
    })
    const { status, data: session } = useSession()
    useEffect(() => {
        if (status === "unauthenticated") {
            signIn("anonymous", { redirect: false, })
        }
    }, [status])

    const { showDialog } = useGlobalDialog()
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
                                    placeholder: "名前を入力してください(必須)",
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
    const session = await getServerSession(ctx.req, ctx.res, authOptions)
    const user = session && await getUser(session.user.userId)
    return {
        props: {
            user,
        }
    }
}
