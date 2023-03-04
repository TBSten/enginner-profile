import SeoHead from "@/components/Seo";
import BaseLayout from "@/components/layout/BaseLayout";
import { useGlobalDialog } from "@/lib/client/dialog";
import { LOCAL_PROF_KEY, saveLocal } from "@/lib/client/saveLocal";
import { useSessionUser } from "@/lib/client/user";
import { ProfSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Button, Container, InputBase, Stack } from '@mui/material';
import { NextPage } from 'next';
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z.object({
    name: z.string().min(3, { message: "プロフの名前は3文字以上入力してください" }),
})

interface Props {
}
const NewProfPage: NextPage<Props> = ({ }) => {
    const { user } = useSessionUser()
    const { register, handleSubmit, formState: { errors, isValid, isSubmitting }, setValue } = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: user?.name ?? "",
        },
    })
    useEffect(() => {
        if (user?.name) setValue("name", user.name)
    }, [setValue, user])
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

    const { showDialog } = useGlobalDialog()
    return (
        <>
            <BaseLayout>
                <NewProfHead />
                <Box width="100%" height="100%">
                    <Stack direction="column" justifyContent="center" alignItems="center" sx={{ py: 2 }}
                        component="form" onSubmit={onNewProf}
                    >
                        <Container maxWidth="lg">
                            {user?.type !== "normal" &&
                                <Alert severity="warning" sx={{ my: 2 }}>
                                    ログインしないで作成したプロフはあとで編集・削除できず、1ヶ月の有効期限が付与されます。
                                </Alert>
                            }
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
                                    error={!!errors}
                                />
                                {errors.name &&
                                    <Alert severity="error">
                                        エラー:
                                        {errors.name.message}
                                    </Alert>
                                }
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
            </BaseLayout>
        </>
    );
}
export default NewProfPage;

interface NewProfHeadProps {
}
const NewProfHead: FC<NewProfHeadProps> = () => {
    return (
        <Head>
            <SeoHead
                pageTitle="新しいプロフを作成"
                pageDescription="えんぷろはプログラミングを学ぶ学生やエンジニア向けの手軽な自己紹介を作成するためのサービスです。\nこのページは新しいプロフを作成するページです。"
                pageImg="https://enginner-prof.info/enginner-prof-icon.og.png"
                pageImgWidth={500}
                pageImgHeight={500}
            />
            <title>{"新しいプロフを作成"}</title>
        </Head>);
}

// export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
//     return {
//         props: {
//         }
//     }
// }
