import Center from '@/components/Center';
import SeoHead from '@/components/Seo';
import BaseLayout from '@/components/layout/BaseLayout';
import LayoutContent from '@/components/layout/LayoutContent';
import { themeTypeToComponent } from '@/components/prof';
import { getProf } from '@/lib/server/prof';
import { theme as baseTheme } from "@/styles/theme";
import { Prof, ProfSchema } from '@/types';
import { FiberNew } from '@mui/icons-material';
import { Box, Button, Stack, ThemeProvider, Tooltip, createTheme } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FC, useEffect, useMemo, useReducer } from 'react';
import { TwitterIcon, TwitterShareButton } from 'react-share';

interface Props {
    prof: Prof
}
const ProfViewPage: NextPage<Props> = ({ prof }) => {
    const ProfViewComponent = themeTypeToComponent(prof.theme.type)
    const router = useRouter()
    const handleNewFromProf = async () => {
        // profをもとに新しいプロフを新規作成
        const templateProfId = prof.profId
        const res = await fetch(`/api/prof`, {
            method: "POST",
            body: JSON.stringify({
                templateProfId,
            }),
        }).then(r => r.json())
        const newProf = ProfSchema.parse(res)
        console.log(newProf)
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
    return (
        <>
            <ThemeProvider theme={theme}>
                <ProfViewHead prof={prof} />
                <BaseLayout>
                    <HeaderSection
                        prof={prof}
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
                // pageImg={`/api/prof/${prof.profId}/og`}
                pageImg={`/enginner-prof-icon.png`}
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
}
const HeaderSection: FC<HeaderSectionProps> = ({ prof }) => {
    const [loc, initLoc] = useReducer<() => Location | null>(() => location, null)
    useEffect(() => initLoc(), [])
    return (
        <LayoutContent>
            <Stack
                p={2}
                direction="row"
                justifyContent="space-between"
                borderRadius="1rem"
                overflow="auto"
                bgcolor="background.paper"
            >
                <Box>
                    {prof.name} さんのプロフィール
                </Box>
                <Box>
                    {prof.publish &&
                        <Tooltip title="Twitterでシェア">
                            <TwitterShareButton
                                url={`${loc?.origin}/prof/${prof.profId}`}
                                hashtags={["エンジニアプロフ"]}
                                title={`${prof.name} のプロフ \n\n`}
                            >
                                <TwitterIcon size={32} round />
                            </TwitterShareButton>
                        </Tooltip>
                    }
                </Box>
            </Stack>
        </LayoutContent>
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
    try {
        // キャッシュを無効化
        ctx.res.setHeader('Cache-Control', 'max-age=5')

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
    } catch (e) {
        console.error("error happened!")
        console.error(e)
        return {
            notFound: true,
        }
    }
}