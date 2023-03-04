import Center from '@/components/Center';
import Right from '@/components/Right';
import SeoHead from '@/components/Seo';
import BaseLayout from '@/components/layout/BaseLayout';
import LayoutContent from '@/components/layout/LayoutContent';
import { copyToClipboard } from '@/lib/client/copy';
import { useGlobalDialog } from '@/lib/client/dialog';
import { useSessionUser } from '@/lib/client/user';
import { getProf, hasViewPermission } from '@/lib/server/prof';
import { getGoodCount } from '@/lib/server/prof/good';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { themeTypeToComponent } from '@/prof-theme/components';
import { theme as baseTheme } from "@/styles/theme";
import { Prof, ProfSchema } from '@/types';
import { ContentCopy, Edit, Favorite, FavoriteBorder, FiberNew } from '@mui/icons-material';
import { Alert, Box, Button, Chip, IconButton, Stack, ThemeProvider, Tooltip, createTheme } from '@mui/material';
import { format } from 'date-fns';
import { GetServerSideProps, NextPage } from 'next';
import { getServerSession } from 'next-auth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FC, useEffect, useMemo, useReducer, useState } from 'react';
import { TwitterIcon, TwitterShareButton } from 'react-share';

interface Props {
    prof: Prof
    sentGood: boolean
    goodCount: number
}
const ProfViewPage: NextPage<Props> = ({ prof, sentGood, goodCount }) => {
    const ProfViewComponent = themeTypeToComponent(prof.theme.type)
    const router = useRouter()
    const { showDialog } = useGlobalDialog()
    const handleNewFromProf = async () => {
        showDialog(`${prof.name}さんのプロフをもとに新しいプロフを作成中...`, { canClose: false })
        // profをもとに新しいプロフを新規作成
        const templateProfId = prof.profId
        const res = await fetch(`/api/prof`, {
            method: "POST",
            body: JSON.stringify({
                templateProfId,
            }),
        }).then(r => r.json())
        const newProf = ProfSchema.parse(res)
        showDialog(`新しいプロフへ移動中...`)
        router.push(`/prof/${newProf.profId}/edit`)
    }
    const theme = useMemo(() => {
        const theme = createTheme(baseTheme, {
            palette: {
                primary: {
                    main: prof.theme.color,
                },
                secondary: {
                    main: baseTheme.palette.getContrastText(prof.theme.color),
                },
            },
        })
        return theme
    }, [prof.theme.color])
    useSessionUser()

    return (
        <>
            <ThemeProvider theme={theme}>
                <ProfViewHead prof={prof} />
                <BaseLayout>
                    <HeaderSection
                        prof={prof}
                        sentGood={sentGood}
                        goodCount={goodCount}
                    />
                    <LayoutContent>
                        <ProfViewComponent
                            prof={prof}
                        />
                    </LayoutContent>
                    <ActionsSection
                        prof={prof}
                        onNewFromProf={handleNewFromProf}
                    />
                    <FooterSection
                        prof={prof}
                    />
                </BaseLayout>
            </ThemeProvider>
        </>
    );
}
export default ProfViewPage;

interface ProfViewHeadProps {
    prof: Prof
}
const ProfViewHead: FC<ProfViewHeadProps> = ({ prof }) => {
    const skillNames = prof.skills.filter(sk => sk.appeal).map(sk => sk.name).join(" , ")
    const profItems = prof.profItems.filter(sk => sk.appeal).map(sk => sk.name).join(" , ")
    return (
        <>
            <SeoHead
                pageTitle={`${prof.name}のプロフィール`}
                pageDescription={`${prof.freeSpace} | ${skillNames} | ${profItems}`}
                pageImg={`https://enginner-prof.info/api/og?profId=${prof.profId}`}
                pageImgWidth={1200}
                pageImgHeight={630}
            />
            <Head>
            </Head>
        </>
    );
}

interface HeaderSectionProps {
    prof: Prof
    sentGood: boolean
    goodCount: number
}
const HeaderSection: FC<HeaderSectionProps> = ({ prof, sentGood: defaultSentGood, goodCount }) => {
    const [loc, initLoc] = useReducer<() => Location | null>(() => location, null)
    useEffect(() => initLoc(), [])
    const profUrl = `${loc?.origin}/prof/${prof.profId}`
    const handleCopy = async () => {
        await copyToClipboard(profUrl)
        // onSnackbarShow("URLをコピーしました")
    }
    const { user } = useSessionUser()
    const [sentGood, setSentGood] = useState(defaultSentGood)
    const isAuthor = user?.userId === prof.authorId
    const handleGood = async () => {
        if (sentGood) {
            setSentGood(false)
            try {
                await fetch(`/api/prof/${prof.profId}/good`, {
                    method: "DELETE",
                }).then(r => r.json())
            } catch (e) {
                setSentGood(true)
            }
        } else {
            setSentGood(true)
            try {
                await fetch(`/api/prof/${prof.profId}/good`, {
                    method: "POST",
                }).then(r => r.json())
            } catch (e) {
                setSentGood(false)
            }
        }
    }
    const hasExpire = prof.expireAt !== null
    const expireText = hasExpire && format(prof.expireAt ?? 0, "yyyy年MM月dd日 H時m分")
    return (
        <>
            {hasExpire &&
                <LayoutContent>
                    <Alert severity='warning'>
                        このプロフは {expireText} まで有効です。
                    </Alert>
                </LayoutContent>
            }
            <LayoutContent>
                <Stack
                    p={2}
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    borderRadius="1rem"
                    overflow="auto"
                    bgcolor="background.paper"
                >
                    <Center>
                        {prof.name} さんのプロフィール
                    </Center>
                    <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
                        {prof.publish &&
                            <>
                                <Tooltip title="Twitterでシェア">
                                    <Center>
                                        <TwitterShareButton
                                            url={`${loc?.origin}/prof/${prof.profId}`}
                                            hashtags={["エンジニアプロフ"]}
                                            title={`${prof.name} のプロフ \n\n`}
                                            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                                        >
                                            <TwitterIcon size={32} round />
                                        </TwitterShareButton>
                                    </Center>
                                </Tooltip>
                                <Tooltip title="URLをコピー">
                                    <Center>
                                        <IconButton onClick={handleCopy}>
                                            <ContentCopy />
                                        </IconButton>
                                    </Center>
                                </Tooltip>
                            </>
                        }
                        <Tooltip title={!user ? "ログインするとGoodできます" : ""}>
                            <Stack direction="column">
                                <IconButton onClick={handleGood} disabled={!user}>
                                    {sentGood
                                        ? <Favorite color='primary' />
                                        : <FavoriteBorder />
                                    }
                                </IconButton>
                                <Center>
                                    {goodCount + (!defaultSentGood && sentGood ? +1 : defaultSentGood && !sentGood ? -1 : 0)}
                                </Center>
                            </Stack>
                        </Tooltip>
                    </Stack>
                </Stack>
            </LayoutContent>
            {isAuthor && !hasExpire &&
                <LayoutContent>
                    <Stack direction="row" justifyContent="space-between" bgcolor="background.paper" p={2} borderRadius="1rem">
                        <Box>
                            {prof.publish
                                ? <Chip color="primary" label="公開中" />
                                : <Chip label="未公開" />
                            }
                        </Box>
                        <Box>
                            <Button variant='outlined' startIcon={<Edit />} href={`/prof/${prof.profId}/edit`}>
                                編集する
                            </Button>
                        </Box>
                    </Stack>
                    <Right>
                    </Right>
                </LayoutContent>
            }
        </>
    );
}

interface ActionsSectionProps {
    prof: Prof
    onNewFromProf: () => void
}
const ActionsSection: FC<ActionsSectionProps> = ({
    prof, onNewFromProf,
}) => {
    return (
        <LayoutContent>
            <Box bgcolor="background.paper" p={2} borderRadius="1rem">
                <Center>
                    <Button
                        variant='outlined'
                        startIcon={<FiberNew />}
                        onClick={onNewFromProf}
                    >
                        このプロフをもとに新しいプロフを作成
                    </Button>
                </Center>
            </Box>
        </LayoutContent>
    );
}

interface FooterSectionProps {
    prof: Prof
}
const FooterSection: FC<FooterSectionProps> = ({ prof }) => {
    return (
        <LayoutContent disablePadding>
            <Center py={1}>
                generated by エンジニアプロフ
            </Center>
        </LayoutContent>
    );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions)
    if (!session) {
        throw new Error("please login or login as anonymous")
    }
    try {
        // キャッシュを無効化
        ctx.res.setHeader('Cache-Control', 'max-age=5')

        const profId = ctx.query.profId as string
        const prof = await getProf(profId)
        // profが存在しない場合は404
        if (!prof) {
            return { notFound: true }
        }
        // セッションユーザでprofを閲覧する権限がないなら404
        if (! await hasViewPermission(session?.user.userId, prof)) {
            console.warn("the user not have permission to view prof", prof, session.user)
            return { notFound: true }
        }
        const sentGood =
            (session !== null &&
                (await getGoodCount(profId, session.user.userId)) === 1
            )
        const goodCount = await getGoodCount(profId)
        return {
            props: {
                prof,
                sentGood,
                goodCount,
            }
        }
    } catch (e) {
        console.error("error happened!")
        console.error(e)
        return {
            notFound: true,
        }
    }
}
