import Center from '@/components/Center';
import ColorPicker from '@/components/ColorPicker';
import DefaultImageSelector from '@/components/DefaultImageSelector';
import MenuButton from '@/components/MenuButton';
import Right from '@/components/Right';
import SeoHead from '@/components/Seo';
import TextEditButton from '@/components/TextEditButton';
import ThemeTypePicker from '@/components/ThemeTypePicker';
import UtilDialog, { useUtilDialog } from '@/components/UtilDialog';
import BaseLayout from '@/components/layout/BaseLayout';
import LayoutContent from '@/components/layout/LayoutContent';
import { copyToClipboard } from '@/lib/client/copy';
import { chooseFile } from '@/lib/client/file';
import { useLoading } from '@/lib/client/loading';
import { useResponsive } from '@/lib/client/responsive';
import { useSavable } from '@/lib/client/savable';
import { LOCAL_PROF_KEY, getLocal, saveLocal } from '@/lib/client/saveLocal';
import { upload } from '@/lib/client/upload';
import { useSessionUser } from '@/lib/client/user';
import { getProf, hasEditPermission } from '@/lib/server/prof';
import { tokenToUserId } from '@/lib/server/user/token';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Assessment, Prof, ProfItem, ProfItemValue, ProfSchema, Skill, ThemeType } from '@/types';
import { Add, Clear, ContentCopy, Delete, Edit, KeyboardArrowUp, KeyboardDoubleArrowDown, KeyboardDoubleArrowUp, MoreVert, Save } from '@mui/icons-material';
import { Alert, Box, Button, CircularProgress, Container, DialogActions, DialogContent, DialogTitle, Divider, Fab, Grid, IconButton, InputBase, ListItemIcon, Menu, MenuItem, Popover, Slider, Snackbar, Stack, Switch, TextField, Tooltip, useTheme } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import { getServerSession } from 'next-auth';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { FC, MouseEventHandler, ReactNode, useCallback, useEffect, useReducer, useRef, useState } from "react";
import { TwitterIcon, TwitterShareButton } from 'react-share';

interface Props {
    prof: Prof
}
const ProfDetailPage: NextPage<Props> = ({ prof: defaultProf }) => {
    // const [prof, setProf] = useState(defaultProf)
    const [prof, setProf, { hasNotSaved, handleSave }] = useSavable(defaultProf)
    const [snackbarContent, setSnackbarContent] = useState<null | string>(null)
    useEffect(() => {
        const saveData = getLocal(LOCAL_PROF_KEY)
        if (saveData === null) { return }

        const savedProf = ProfSchema.parse(saveData)
        if (savedProf.profId === defaultProf.profId) {
            setProf(savedProf)
        } else {
            // ??????????????????????????????????????????
            console.warn("can not save")
        }
    }, [defaultProf.profId, setProf])
    const handleSaveProf = handleSave(async () => {
        // TODO save prof
        saveLocal(LOCAL_PROF_KEY, prof)
        await fetch(`/api/prof/${prof.profId}`, {
            method: "PUT",
            body: JSON.stringify(prof),
        })
        setSnackbarContent("??????????????????")
    })

    const handleChangeName =
        useCallback((name: string) => setProf(p => ({ ...p, name })), [setProf])
    const handleChangeFreeSpace =
        useCallback((freeSpace: string) => setProf(p => ({ ...p, freeSpace })), [setProf])
    const handleChangeIcon =
        useCallback((icon: string) => setProf(p => ({ ...p, icon })), [setProf])
    const handleChangeColor =
        useCallback((color: string) => setProf(p => ({ ...p, theme: { ...p.theme, color } })), [setProf])
    const handleChangeThemeType =
        useCallback((type: ThemeType) => setProf(p => ({ ...p, theme: { ...p.theme, type } })), [setProf])
    const handleChangeSkills: SkillsSectionProps["onChangeSkills"] =
        useCallback(updater => setProf(p => ({ ...p, skills: updater(p.skills) })), [setProf])
    const handleChangeSkillComment =
        useCallback((skillComment: string | null) => setProf(p => ({ ...p, skillComment })), [setProf])
    const handleChangeProfItemComment =
        useCallback((profItemComment: string | null) => setProf(p => ({ ...p, profItemComment })), [setProf])
    const handleChangeProfItems: ProfItemsSectionProps["onChangeProfItems"] =
        useCallback(updater => setProf(p => ({ ...p, profItems: updater(p.profItems) })), [setProf])
    const handleChangePublich: OutputSectionProps["onChangePublish"] =
        useCallback(publish => setProf(p => ({ ...p, publish })), [setProf])
    const handleChangeSlug: OverviewProps["onChangeSlug"] =
        useCallback(slug => setProf(p => ({ ...p, slug })), [setProf])
    const handleChangeImages: OverviewProps["onChangeImages"] =
        useCallback(updater => setProf(p => ({ ...p, images: updater(p.images) })), [setProf])

    const router = useRouter()
    const handleDeleteProf = () => {
        router.push(`/`)
    }

    const { user } = useSessionUser()

    useEffect(() => {
        // keyboard handler
        const handleKeydown = (e: KeyboardEvent) => {
            if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
                // ??????
                e.preventDefault()
                handleSaveProf()
            }
        }
        // closing handler
        const handleOnBeforeUnload = (e: BeforeUnloadEvent) => {
            if (!hasNotSaved()) return
            e.returnValue = "??????????????????????????????????????????????????????????????????????????????"
            return e.returnValue
        }
        document.addEventListener("keydown", handleKeydown)
        window.addEventListener("beforeunload", handleOnBeforeUnload)
        return () => {
            document.removeEventListener("keydown", handleKeydown)
            window.removeEventListener("beforeunload", handleOnBeforeUnload)
        }
    }, [handleSaveProf, hasNotSaved])

    return (
        <>
            <ProfDetailHead prof={prof} />
            <BaseLayout>
                <OverviewSection
                    name={prof.name}
                    freeSpace={prof.freeSpace}
                    icon={prof.icon}
                    images={prof.images}
                    slug={prof.slug}
                    onChangeName={handleChangeName}
                    onChangeFreeSpace={handleChangeFreeSpace}
                    onChangeIcon={handleChangeIcon}
                    onChangeSlug={handleChangeSlug}
                    onChangeImages={handleChangeImages}
                />
                <Divider />
                <ThemeEditSection
                    themeType={prof.theme.type}
                    onChangeThemeType={handleChangeThemeType}
                    color={prof.theme.color}
                    onChangeColor={handleChangeColor}
                />
                <SkillsSection
                    skills={prof.skills}
                    skillComment={prof.skillComment}
                    onChangeSkills={handleChangeSkills}
                    onChangeSkillComment={handleChangeSkillComment}
                    onAddSkillComment={() => handleChangeSkillComment("??? ????????????????????????????????????????????????\n?????? ????????????????????????????????????????????????????????????")}
                />
                <ProfItemsSection
                    profItems={prof.profItems}
                    profItemComment={prof.profItemComment}
                    onChangeProfItems={handleChangeProfItems}
                    onChangeProfItemComment={handleChangeProfItemComment}
                />
                <Divider />
                <OutputSection
                    profId={prof.profId}
                    name={prof.name}
                    publish={prof.publish}
                    onChangePublish={handleChangePublich}
                    onSave={handleSaveProf}
                    onSnackbarShow={(text) => setSnackbarContent(text)}
                    isLogined={user?.type === "normal"}
                />
                <DangerousSection
                    onDeleteProf={handleDeleteProf}
                />
                <FooterSection />
                <Fixed
                    onSave={handleSaveProf}
                />
                <Snackbar
                    open={!!snackbarContent}
                    onClose={() => setSnackbarContent(null)}
                    autoHideDuration={3000}
                    message={snackbarContent}
                />

            </BaseLayout>
        </>
    );
}
export default ProfDetailPage;


export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    try {
        const session = await getServerSession(ctx.req, ctx.res, authOptions)
        const id = ctx.query.profId as string
        const prof = await getProf(id)
        if (prof === null) {
            return { notFound: true }
        }
        const userId = session?.user.userId
            ?? await tokenToUserId(ctx.req.cookies._enginner_prof_user_token ?? "invalid token")
        // ?????????????????????????????????
        if (!await hasEditPermission(userId, prof)) {
            console.warn("the user not have permission to edit", "prof", prof, "access user", session?.user)
            return {
                notFound: true,
            }
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


interface ProfDetailHeadProps {
    prof: Prof
}
const ProfDetailHead: FC<ProfDetailHeadProps> = ({ prof }) => {
    const skillNames = prof.skills.filter(sk => sk.appeal).map(sk => sk.name).join(" , ")
    const profItems = prof.profItems.filter(sk => sk.appeal).map(sk => sk.name).join(" , ")
    return (
        <Head>
            <SeoHead
                pageTitle={`${prof.name}??????????????????????????????`}
                pageDescription={`${prof.freeSpace} | ${skillNames} | ${profItems}`}
                pageImg={`https://enginner-prof.info/api/og?profId=${prof.profId}`}
                pageImgWidth={1200}
                pageImgHeight={630}
            />
            <title>{`${prof.name}?????????????????????`}</title>
        </Head>
    );
}

interface OverviewProps {
    name: string
    freeSpace: string
    icon: string
    images: string[]
    slug: string | null
    onChangeName: (name: string) => void
    onChangeFreeSpace: (freeSpace: string) => void
    onChangeIcon: (icon: string) => void
    onChangeImages: (updater: ((p: string[]) => string[])) => void
    onChangeSlug: (slug: string | null) => void
}
const OverviewSection: FC<OverviewProps> = ({
    name, freeSpace, icon, slug, images,
    onChangeName, onChangeFreeSpace, onChangeIcon, onChangeSlug, onChangeImages,
}) => {
    const theme = useTheme()
    const [isUploadingIcon, withUploadIcon] = useLoading()
    const handleUploadIcon = async () => {
        const file = await chooseFile("image/*")
        withUploadIcon(async () => {
            const { publicUrl } = await upload(file)
            onChangeIcon(publicUrl)
        })
    }
    const [isUploadingImage, withUploadImage] = useLoading()
    const handleUploadImage = async () => {
        const file = await chooseFile("image/*")
        withUploadImage(async () => {
            const { publicUrl } = await upload(file)
            onChangeImages(p => [...p, publicUrl])
        })
    }
    const handleDeleteImage = (img: string) => () => {
        onChangeImages(p => p.filter(i => i !== img))
    }


    const iconSize = 100
    const imgRef = useRef<HTMLImageElement>(null)
    const [openImgPopover, setOpenImgPopover] = useState(false)
    return (
        <LayoutContent bgcolor={theme.palette.background.paper}>
            <Grid container spacing={2} direction="row" alignItems="center">
                <Grid item xs={12} md="auto">
                    <Stack direction="column" alignItems="center" onClick={() => setOpenImgPopover(true)}>
                        <Box borderRadius={2} overflow="hidden" width={iconSize} height={iconSize}>
                            <Box position="relative">
                                {isUploadingIcon &&
                                    <Center position="absolute" left={0} top={0} width="100%" height="100%" bgcolor="rgba(0,0,0,0.5)">
                                        <CircularProgress size={iconSize * 0.9} />
                                    </Center>
                                }
                                <Image
                                    src={icon}
                                    alt={name}
                                    width={iconSize}
                                    height={iconSize}
                                    style={{ objectFit: "cover" }}
                                    ref={imgRef}
                                />
                            </Box>
                        </Box>
                        <Box component="span" textAlign="center" width={100} pt={1} fontSize="0.8em">
                            ????????? <br />
                            ??????????????????
                        </Box>
                    </Stack>
                    <Popover
                        anchorEl={imgRef.current}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                        open={openImgPopover}
                        onClose={() => setOpenImgPopover(false)}
                    >
                        <Box p={1} maxWidth="50vw">
                            <DefaultImageSelector
                                img={icon}
                                onChange={(img) => onChangeIcon(img)}
                            />
                            <Divider>?????????</Divider>
                            <Button onClick={handleUploadIcon} fullWidth>
                                ?????????????????????????????????
                            </Button>
                        </Box>
                    </Popover>
                </Grid>
                <Grid item xs={12} md >
                    <InputBase
                        value={name}
                        onChange={e => onChangeName(e.target.value)}
                        fullWidth sx={{ fontSize: "3rem" }}
                        placeholder='?????????????????? (??????)'
                    />
                    <Divider />
                    <Box px={1}>
                        <InputBase
                            value={freeSpace}
                            onChange={e => onChangeFreeSpace(e.target.value)}
                            placeholder='??????????????? (??????)'
                            fullWidth
                            minRows={5} maxRows={10} multiline
                        />
                    </Box>
                </Grid>
            </Grid>
            <Box>
                ?????? (???????????????????????????????????????????????????????????????)
            </Box>
            <Stack direction="row" width="100%" overflow="auto" px={2} py={1} spacing={1} alignItems="flex-start" flexWrap="nowrap">
                {images.map(img =>
                    <Box key={img} overflow="hidden" borderRadius="1rem" position="relative" minWidth="fit-content" minHeight="fit-content">
                        <Image
                            src={img}
                            alt={img}
                            width={300}
                            height={200}
                            style={{ width: 300, height: "auto" }}
                        />
                        <IconButton
                            color="inherit"
                            sx={{ position: "absolute", left: 0, top: 0 }}
                            onClick={handleDeleteImage(img)}
                        >
                            <Clear />
                        </IconButton>
                    </Box>
                )}
                {isUploadingImage &&
                    <CircularProgress />
                }
                <Center height="100%" px={4}>
                    <Button variant='outlined' sx={{ aspectRatio: "1 / 1" }} onClick={handleUploadImage}>
                        ??????
                    </Button>
                </Center>
            </Stack>
        </LayoutContent>
    );
}

interface ThemeEditProps {
    themeType: ThemeType
    color: string
    onChangeThemeType: (type: ThemeType) => void
    onChangeColor: (color: string) => void
}
const ThemeEditSection: FC<ThemeEditProps> = React.memo(function ThemeEditSection({
    color, onChangeColor,
    themeType, onChangeThemeType,
}) {
    return (
        <LayoutContent>
            <Center flexDirection={{ xs: "column", md: "row" }} justifyContent="space-around" p={1}>
                <Box p={{ xs: 1, md: 0 }}>
                    <ThemeTypePicker
                        type={themeType}
                        onChange={(type) => onChangeThemeType(type)}
                    />
                </Box>
                <Divider flexItem />
                <Box p={{ xs: 1, md: 0 }}>
                    <ColorPicker
                        color={color}
                        onChange={(color) => onChangeColor(color)}
                    />
                </Box>
            </Center>
        </LayoutContent>
    );
})

const defaultSkill = (): Skill => ({
    name: "",
    comment: "",
    assessment: {
        value: 0,
        comment: "???????????????/????????????",
    },
    appeal: true,
})
interface SkillsSectionProps {
    skills: Skill[]
    skillComment: string | null
    onChangeSkills: (updater: ((p: Skill[]) => Skill[])) => void
    onChangeSkillComment: (comment: string | null) => void
    onAddSkillComment: () => void
}
const SkillsSection: FC<SkillsSectionProps> = React.memo(function SillsSection({
    skills, skillComment,
    onChangeSkills, onChangeSkillComment, onAddSkillComment,
}) {
    const handleChangeName = (idx: number) => (newName: string) => {
        onChangeSkills(p => {
            const newSkills = [...p];
            newSkills[idx] = {
                ...newSkills[idx],
                name: newName,
            };
            return newSkills;
        });
    };
    const handleChangeComment = (idx: number) => (newComment: string) => {
        onChangeSkills(p => {
            const newSkills = [...p];
            newSkills[idx] = {
                ...newSkills[idx],
                comment: newComment,
            };
            return newSkills;
        });
    };
    const handleChangeAssessment = (idx: number) => (newAssessment: Assessment) => {
        onChangeSkills(p => {
            const newSkills = [...p];
            newSkills[idx] = {
                ...newSkills[idx],
                assessment: newAssessment,
            };
            return newSkills;
        });
    };
    const handleChangeAppeal = (idx: number) => (newAppeal: boolean) => {
        onChangeSkills(p => {
            const newSkills = [...p];
            newSkills[idx] = {
                ...newSkills[idx],
                appeal: newAppeal,
            };
            return newSkills;
        });
    };
    const handleAddSkill = () => {
        onChangeSkills(p => [...p, defaultSkill()]);
    };
    const handleDelete = (idx: number) => () => {
        onChangeSkills(p => p.filter((_, i) => idx !== i));
    };
    const handleMoveToUp = (idx: number) => () => {

        onChangeSkills(p => {
            if (idx === 0) return p
            const newSkills = [...p]
            const work = newSkills[idx]
            newSkills[idx] = newSkills[idx - 1]
            newSkills[idx - 1] = work
            return newSkills
        })
    }
    const handleMoveToDown = (idx: number) => () => {
        onChangeSkills(p => {
            if (idx === p.length - 1) return p
            const newSkills = [...p]
            const work = newSkills[idx]
            newSkills[idx] = newSkills[idx + 1]
            newSkills[idx + 1] = work
            return p
        })
    }
    const [openMenu, setOpenMenu] = useState(false)
    const handleAddSkillComment = () => {
        setOpenMenu(false)
        onAddSkillComment()
    }
    const menuItems: ReactNode[] = []
    if (skillComment === null)
        menuItems.push(
            <MenuItem onClick={handleAddSkillComment} key="add skill comment">
                ???????????????????????????
            </MenuItem>
        )
    return (
        <LayoutContent>
            <Grid container alignItems="center">
                <Grid item xs fontWeight="bold" fontSize="1.5em" color={t => t.palette.primary.main}>
                    ?????????
                </Grid>
                <Grid item xs="auto">
                    {skills.length}???????????????
                </Grid>
                <Grid item xs="auto">
                    {menuItems.length >= 1 &&
                        <MenuButton open={openMenu} onOpen={() => setOpenMenu(true)} onClose={() => setOpenMenu(false)}>
                            {menuItems}
                        </MenuButton>
                    }
                </Grid>
            </Grid>
            <Box>
                {skillComment !== null &&
                    <Stack>
                        <TextField
                            value={skillComment} onChange={e => onChangeSkillComment(e.target.value)}
                            placeholder='????????????????????????????????????????????? (??????)'
                            multiline rows={3}
                            fullWidth
                            color="primary"
                        />
                        <Right>
                            <Button onClick={() => onChangeSkillComment(null)}>
                                ???????????????
                            </Button>
                        </Right>
                    </Stack>
                }
            </Box>
            {skills.map((skill, idx) => <Box key={idx} py={0.5}>
                <EditableSkill
                    skill={skill}
                    onChangeName={handleChangeName(idx)}
                    onChangeComment={handleChangeComment(idx)}
                    onChangeAssessment={handleChangeAssessment(idx)}
                    onChangeAppeal={handleChangeAppeal(idx)}
                    onDelete={handleDelete(idx)}
                    onMoveToUp={handleMoveToUp(idx)}
                    onMoveToDown={handleMoveToDown(idx)}
                />
            </Box>
            )}
            {skills.length === 0 &&
                <Box p={2}>
                    <Alert severity='warning'>
                        ???????????????????????????????????????<br />
                        ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                    </Alert>
                </Box>}
            <Box px={1} py={1}>
                <Button variant='text' startIcon={<Add />} fullWidth sx={t => ({ border: `dashed 2px ${t.palette.primary.dark}` })} onClick={handleAddSkill} color="primary">
                    ??????
                </Button>
            </Box>
        </LayoutContent>
    );
})

const assessments: Assessment[] = [
    {
        value: 0 / 3,
        comment: "???????????????/????????????",
    },
    {
        value: 1 / 3,
        comment: "???????????????????????????",
    },
    {
        value: 2 / 3,
        comment: "?????????????????????",
    },
    {
        value: 3 / 3,
        comment: "?????????????????????",
    },
]

interface EditableSkillProps {
    skill: Skill
    onChangeName: (value: string) => void
    onChangeComment: (value: string) => void
    onChangeAssessment: (value: Assessment) => void
    onChangeAppeal: (value: boolean) => void
    onDelete: () => void
    onMoveToUp: () => void
    onMoveToDown: () => void
}
const EditableSkill: FC<EditableSkillProps> = React.memo(function EditableSkill({
    skill,
    onChangeName, onChangeComment, onChangeAssessment, onChangeAppeal, onDelete,
    onMoveToUp, onMoveToDown,
}) {
    const [openMenu, setOpenMenu] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);
    const handleChangeAssessment = (assessment: Assessment) => {
        onChangeAssessment(assessment)
    }
    const handleMoveToUp = () => {
        setOpenMenu(false)
        onMoveToUp()
    }
    const handleMoveToDown = () => {
        setOpenMenu(false)
        onMoveToDown()
    }
    const handleDelete = () => {
        setOpenMenu(false);
        onDelete();
    };
    const { responsive } = useResponsive()
    return (
        <Box p={1} sx={t => ({ bgcolor: t.palette.background.paper })} overflow="auto">
            <Grid container width="100%">
                <Grid item xs="auto" px={1} color={t => t.palette.primary.main}>
                    {/* TODO SKILL ICON */}
                    #
                </Grid>
                <Grid item xs px={1}>
                    <InputBase
                        value={skill.name}
                        onChange={e => onChangeName(e.target.value)}
                        fullWidth
                        placeholder='????????????????????? (??????)'
                        sx={{ fontWeight: "bold" }}
                    />
                </Grid>
                <Grid item xs={12} sm="auto" px={1}>
                    <AssessmentInput
                        assessment={skill.assessment}
                        onChange={handleChangeAssessment}
                        skillName={skill.name}
                    />
                </Grid>
                <Grid item xs="auto" px={1}>
                    <TextEditButton
                        icon={responsive(<><Edit /></>, <></>)}
                        label="?????????????????????"
                        value={skill.comment}
                        onChange={e => onChangeComment(e.target.value)}
                        placeholder='????????????????????? (??????)'
                        multiline rows={3}
                    />
                </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
                <Grid item xs="auto" px={1}>
                    <Stack direction="row" alignItems="center">
                        <Box>????????????</Box>
                        <Switch
                            checked={skill.appeal}
                            onChange={(e, newValue) => onChangeAppeal(newValue)} />
                    </Stack>
                </Grid>
                <Grid item xs="auto" px={1}>
                    <Stack direction="row" justifyContent={{ xs: "flex-end", md: "start" }} alignItems="center">
                        <IconButton onClick={() => setOpenMenu(true)} ref={btnRef}>
                            <MoreVert />
                        </IconButton>
                        <Menu open={openMenu} onClose={() => setOpenMenu(false)} anchorEl={btnRef.current}>
                            <MenuItem onClick={handleMoveToUp}>
                                <ListItemIcon>
                                    <KeyboardDoubleArrowUp />
                                </ListItemIcon>
                                ????????????
                            </MenuItem>
                            <MenuItem onClick={handleMoveToDown}>
                                <ListItemIcon>
                                    <KeyboardDoubleArrowDown />
                                </ListItemIcon>
                                ????????????
                            </MenuItem>
                            <MenuItem onClick={handleDelete}>
                                <ListItemIcon>
                                    <Delete />
                                </ListItemIcon>
                                ??????
                            </MenuItem>
                        </Menu>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
})

interface AssessmentInputProps {
    skillName: string
    assessment: Assessment
    onChange: (assessment: Assessment) => void
}
const AssessmentInput: FC<AssessmentInputProps> = ({
    assessment, onChange,
    skillName,
}) => {
    const selectedAssessment = assessment
    const menuAnchorRef = useRef<HTMLButtonElement>(null)
    const [openMenu, setOpenMenu] = useState(false)
    const handleSelectAssessment = (assessment: Assessment) => () => {
        onChange(assessment)
    }
    const [openDialog, setOpenDialog] = useState(false)
    const handleOpenDialog = () => {
        setOpenDialog(true)
    }
    return (
        <>
            <Button variant="outlined" fullWidth onClick={() => setOpenMenu(true)} ref={menuAnchorRef}>
                {"??????".repeat(Math.floor(assessment.value * 3 + 1))}
                {"???".repeat(4 - Math.floor(assessment.value * 3 + 1))}
                {" "}
                {assessment.comment}
            </Button>

            <Menu open={openMenu} onClose={() => setOpenMenu(false)} anchorEl={menuAnchorRef.current}>
                {assessments.map(assessment =>
                    <MenuItem onClick={handleSelectAssessment(assessment)} selected={assessment === selectedAssessment} key={assessment.value}>
                        {"??????".repeat(Math.floor(assessment.value * 3 + 1))}
                        {"???".repeat(4 - Math.floor(assessment.value * 3 + 1))}
                        {" "}
                        {assessment.comment}
                    </MenuItem>
                )}
                <MenuItem onClick={handleOpenDialog} selected={!assessments.includes(selectedAssessment)}>
                    <ListItemIcon>
                        <Edit />
                    </ListItemIcon>
                    ????????????
                </MenuItem>
                <MenuItem onClick={() => setOpenMenu(false)}>
                    ?????????
                </MenuItem>
            </Menu>

            <UtilDialog open={openDialog} onClose={() => setOpenDialog(false)} dialogProps={{ fullWidth: true }}>
                <DialogTitle>
                    {skillName}
                </DialogTitle>
                <DialogContent>
                    <Box>
                        ?????????????????? : {Math.floor(assessment.value * 100)}
                        {" "}
                        {"??????".repeat(Math.floor(assessment.value * 3 + 1))}
                        {"???".repeat(4 - Math.floor(assessment.value * 3 + 1))}
                    </Box>
                    <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                        <Slider
                            value={assessment.value}
                            min={0}
                            step={0.01}
                            max={1}
                            onChange={(_, newValue) => onChange({ ...assessment, value: newValue as number })}
                        />
                    </Stack>
                    <Box>????????????</Box>
                    <Box py={2}>
                        <TextField fullWidth
                            value={assessment.comment}
                            onChange={e => onChange({ ...assessment, comment: e.target.value })}
                            placeholder='????????????????????? (??????)'
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={() => setOpenDialog(false)}>
                        OK
                    </Button>
                </DialogActions>
            </UtilDialog>

        </>
    );
}


const defaultProfItem = (): ProfItem => ({
    name: "??????",
    value: {
        type: "text",
        text: "?????????",
    },
    comment: "",
    appeal: false,
})
interface ProfItemsSectionProps {
    profItems: ProfItem[]
    onChangeProfItems: (updater: ((p: ProfItem[]) => ProfItem[])) => void
    profItemComment: string | null
    onChangeProfItemComment: (comment: string | null) => void
}
const ProfItemsSection: FC<ProfItemsSectionProps> = React.memo(function ProfItemsSection({ profItems, onChangeProfItems, profItemComment, onChangeProfItemComment }) {
    const handleAddProfItem = () => {
        onChangeProfItems(p => [...p, defaultProfItem()]);
    };
    const handleChangeProfItemName = (idx: number) => (newName: string) => {
        onChangeProfItems(p => {
            const newProfItems = [...p];
            newProfItems[idx] = {
                ...newProfItems[idx],
                name: newName,
            };
            return newProfItems;
        });
    };
    const handleChangeProfItemValue = (idx: number) => (newValue: ProfItem["value"]) => {
        onChangeProfItems(p => {
            const newProfItems = [...p];
            newProfItems[idx] = {
                ...newProfItems[idx],
                value: newValue,
            };
            return newProfItems;
        });
    };
    const handleChangeProfItemComment = (idx: number) => (newComment: string) => {
        onChangeProfItems(p => {
            const newProfItems = [...p];
            newProfItems[idx] = {
                ...newProfItems[idx],
                comment: newComment,
            };
            return newProfItems;
        });
    };
    const handleChangeProfItemAppeal = (idx: number) => (newAppeal: boolean) => {
        onChangeProfItems(p => {
            const newProfItems = [...p];
            newProfItems[idx] = {
                ...newProfItems[idx],
                appeal: newAppeal,
            };
            return newProfItems;
        });
    };
    const handleMoveToUp = (idx: number) => () => {
        onChangeProfItems(p => {
            // idx???????????????
            if (idx === 0) return p
            const newProfItems = [...p]
            const work = newProfItems[idx]
            newProfItems[idx] = newProfItems[idx - 1]
            newProfItems[idx - 1] = work
            return newProfItems
        })
    }
    const handleMoveToDown = (idx: number) => () => {
        onChangeProfItems(p => {
            // idx???????????????
            if (idx === p.length - 1) return p
            const newProfItems = [...p]
            const work = newProfItems[idx]
            newProfItems[idx] = newProfItems[idx + 1]
            newProfItems[idx + 1] = work
            return newProfItems
        })
    }
    const handleDeleteProfItem = (idx: number) => () => {
        onChangeProfItems(p => p.filter((_, i) => idx !== i));
    };
    const handleAddProfItemComment = () => {
        setOpenMenu(false)
        onChangeProfItemComment("??? ????????????????????? ?????? ??????????????????????????????\n?????? ???????????? ?????? ???????????????????????????????????????????????????")
    }
    const [openMenu, setOpenMenu] = useState(false)
    const menuItems: ReactNode[] = []
    if (profItemComment === null)
        menuItems.push(
            <MenuItem onClick={handleAddProfItemComment} key="add profItem comment">
                ???????????? ?????? ??????????????????
            </MenuItem>
        )
    return (
        <LayoutContent>
            <Grid container alignItems="center">
                <Grid item xs fontWeight="bold" fontSize="1.5em" color={t => t.palette.secondary.main}>
                    ???????????? ??????
                </Grid>
                <Grid item xs="auto">
                    {profItems.length}???????????????
                </Grid>
                <Grid item xs="auto">
                    {menuItems.length >= 1 &&
                        <MenuButton open={openMenu} onOpen={() => setOpenMenu(true)} onClose={() => setOpenMenu(false)}>
                            {menuItems}
                        </MenuButton>
                    }
                </Grid>
            </Grid>
            <Box>
                {profItemComment !== null &&
                    <>
                        <TextField
                            value={profItemComment} onChange={e => onChangeProfItemComment(e.target.value)}
                            placeholder='???????????? ?????? ???????????????????????????????????? (??????)'
                            multiline rows={3}
                            fullWidth
                            color="secondary"
                        />
                        <Right>
                            <Button color="secondary" onClick={() => onChangeProfItemComment(null)}>
                                ???????????????
                            </Button>
                        </Right>
                    </>
                }
            </Box>
            {profItems.map((profItem, idx) => <Box key={idx} py={0.5}>
                <EditableProfItem
                    profItem={profItem}
                    onChangeName={handleChangeProfItemName(idx)}
                    onChangeValue={handleChangeProfItemValue(idx)}
                    onChangeComment={handleChangeProfItemComment(idx)}
                    onChangeAppeal={handleChangeProfItemAppeal(idx)}
                    onMoveToUp={handleMoveToUp(idx)}
                    onMoveToDown={handleMoveToDown(idx)}
                    onDelete={handleDeleteProfItem(idx)} />
            </Box>
            )}
            {profItems.length === 0 &&
                <Box p={2}>
                    <Alert severity='warning'>
                        ?????????????????????????????????<br />
                        ?????????SNS??????????????????????????????????????????????????????
                    </Alert>
                </Box>}
            <Box px={1} py={1}>
                <Button variant='text' startIcon={<Add />} fullWidth sx={t => ({ border: `dashed 2px ${t.palette.secondary.dark}` })} onClick={handleAddProfItem} color="secondary">
                    ??????
                </Button>
            </Box>
        </LayoutContent>
    );
})


interface EditableProfItemProps {
    profItem: ProfItem
    onChangeName: (value: string) => void
    onChangeValue: (value: ProfItem["value"]) => void
    onChangeComment: (value: string) => void
    onChangeAppeal: (value: boolean) => void
    onMoveToUp: () => void
    onMoveToDown: () => void
    onDelete: () => void
}
const EditableProfItem: FC<EditableProfItemProps> = React.memo(function EditableProfItem({
    profItem,
    onChangeName,
    onChangeValue,
    onChangeComment,
    onChangeAppeal,
    onDelete,
    onMoveToUp,
    onMoveToDown,
}) {
    const [openMenu, setOpenMenu] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);
    const { responsive } = useResponsive()
    const handleMoveToUp = () => {
        setOpenMenu(false)
        onMoveToUp()
    }
    const handleMoveToDown = () => {
        setOpenMenu(false)
        onMoveToDown()
    }
    const handleDelete = () => {
        setOpenMenu(false)
        onDelete()
    };
    return (
        <Box p={1} sx={t => ({ bgcolor: t.palette.background.paper })} overflow="auto">
            <Grid container alignItems="center">
                <Grid item xs="auto" px={1}>
                    <Box color="secondary.main">
                        #
                    </Box>
                </Grid>
                <Grid item xs>
                    <InputBase
                        value={profItem.name}
                        onChange={e => onChangeName(e.target.value)}
                        placeholder='?????????????????? (??????)'
                        fullWidth
                        sx={{ fontWeight: "bold", display: "inline" }}
                    />
                </Grid>
            </Grid>
            <Grid container justifyContent="flex-end" alignItems="center">
                <Grid item xs={12} sm px={1}>
                    <ProfItemValueEdit
                        name={profItem.name}
                        value={profItem.value}
                        onChange={value => onChangeValue(value)}
                    />
                </Grid>
                <Grid item xs="auto" sm="auto" px={1}>
                    <TextEditButton
                        color="secondary"
                        icon={responsive(<><Edit /></>, <></>)}
                        label="?????????????????????"
                        value={profItem.comment}
                        onChange={e => onChangeComment(e.target.value)}
                        placeholder='????????????????????? (??????)'
                        multiline rows={3}
                    />
                </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
                <Grid item xs="auto" px={1}>
                    <Stack direction="row" justifyContent={{ xs: "flex-end", md: "start" }} alignItems="center">
                        ????????????
                        <Switch
                            checked={profItem.appeal}
                            onChange={(e, newValue) => onChangeAppeal(newValue)}
                            color="secondary" />
                    </Stack>
                </Grid>
                <Grid item xs="auto" px={1}>
                    <Stack direction="row" justifyContent={{ xs: "flex-end", md: "start" }} alignItems="center">
                        <IconButton onClick={() => setOpenMenu(true)} ref={btnRef}>
                            <MoreVert />
                        </IconButton>
                        <Menu open={openMenu} onClose={() => setOpenMenu(false)} anchorEl={btnRef.current}>
                            <MenuItem onClick={handleMoveToUp}>
                                <ListItemIcon>
                                    <KeyboardDoubleArrowUp />
                                </ListItemIcon>
                                ??????????????????
                            </MenuItem>
                            <MenuItem onClick={handleMoveToDown}>
                                <ListItemIcon>
                                    <KeyboardDoubleArrowDown />
                                </ListItemIcon>
                                ??????????????????
                            </MenuItem>
                            <MenuItem onClick={handleDelete}>
                                <ListItemIcon>
                                    <Delete />
                                </ListItemIcon>
                                ??????
                            </MenuItem>
                        </Menu>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
})

interface ProfItemValueEditProps {
    name: ProfItem["name"]
    value: ProfItemValue
    onChange: (value: ProfItemValue) => void
}
const ProfItemValueEdit: FC<ProfItemValueEditProps> = ({ name, value, onChange }) => {
    const [openMenu, setOpenMenu] = useState(false)
    const btnRef = useRef<HTMLButtonElement>(null)
    return (
        <Box
            display="flex"
            alignItems="center"
            border="solid 1px"
            borderColor={t => t.palette.secondary.main}
            borderRadius={t => t.shape.borderRadius}
            pl={1}
            py={0.5}
        >
            <Box sx={{ flexGrow: 1 }}>
                {value.type === "text" &&
                    <InputBase
                        value={value.text}
                        onChange={e => onChange({ type: "text", text: e.target.value })}
                        placeholder={name + "????????? (??????)"}
                        fullWidth
                    />
                }
                {value.type === "link" &&
                    <Grid container alignItems="center">
                        <Grid item xs="auto">
                            ?????????:
                        </Grid>
                        <Grid item xs>
                            <InputBase
                                value={value.link}
                                onChange={e => onChange({ type: "link", link: e.target.value })}
                                placeholder={name + '????????????????????? (??????)'}
                                fullWidth
                            />

                        </Grid>
                    </Grid>
                }
            </Box>
            <IconButton ref={btnRef} color="secondary" onClick={() => setOpenMenu(true)}>
                <MoreVert />
            </IconButton>
            <Menu open={openMenu} onClose={() => setOpenMenu(false)} anchorEl={btnRef.current}>
                <MenuItem
                    onClick={() => onChange({ type: "text", text: "" })}
                    disabled={value.type === "text"}
                >
                    ????????????
                </MenuItem>
                <MenuItem
                    onClick={() => onChange({ type: "link", link: "https://twitter.com/hogehoge" })}
                    disabled={value.type === "link"}
                >
                    ?????????
                </MenuItem>
            </Menu>
        </Box>
    );
}

interface OutputSectionProps {
    profId: string
    name: string
    publish: boolean
    onChangePublish: (publish: boolean) => void
    onSave: () => Promise<void>
    onSnackbarShow: (text: string) => void
    isLogined: boolean
}
const OutputSection: FC<OutputSectionProps> = React.memo(function OutputSection({
    profId, name,
    publish, onChangePublish, onSave,
    onSnackbarShow,
    isLogined,
}) {
    const theme = useTheme();
    const handleClickPublishButton = async () => {
        await onSave();
        onSnackbarShow("??????????????????")
    };

    const router = useRouter()
    const confirmGotoProfPageDialog = useUtilDialog()
    const handleGotoProfPage: MouseEventHandler<HTMLAnchorElement> = async (e) => {
        e.preventDefault()
        if (isLogined) {
            gotoProfPage()
        } else {
            confirmGotoProfPageDialog.show()
        }
    }
    const gotoProfPage = async () => {
        const href = `/prof/${profId}`
        await onSave()
        router.push(href)
    }

    const [loc, initLoc] = useReducer<() => Location | null>(() => location, null)
    useEffect(() => initLoc(), [])
    const profUrl = `${loc?.origin}/prof/${profId}`
    const handleCopy = async () => {
        await copyToClipboard(profUrl)
        onSnackbarShow("URL????????????????????????")
    }
    return (
        <LayoutContent bgcolor={theme.palette.background.paper}>
            <Container maxWidth="sm">

                <Stack direction={{ xs: "column", md: "row" }} p={4} width="100%" justifyContent="space-between" spacing={2}>
                    <Button
                        variant='contained'
                        sx={{ px: 2, py: 3, borderRadius: "9999px", textAlign: "center" }}
                        size='large'
                        href={`/prof/${profId}`}
                        onClick={handleGotoProfPage}
                    >
                        {isLogined
                            ? "??????????????????????????????"
                            : "??????????????????????????????(??????????????????????????????)"
                        }

                    </Button>
                    <Button
                        variant='contained'
                        sx={{ px: 2, py: 3, borderRadius: "9999px", textAlign: "center" }}
                        size='large'
                        href={`/prof/${profId}/card`}
                        onClick={onSave}
                    >
                        ?????????(??????)?????????
                    </Button>
                </Stack>

                <Stack direction="row" justifyContent="flex-end" alignItems="center" py={1}>
                    <Tooltip title="????????????????????????????????????????????????????????????????????????URL??????????????????????????????????????????????????????????????????">
                        <Stack direction="row" alignItems="center">
                            <Switch
                                checked={publish}
                                onChange={(_, newValue) => onChangePublish(newValue)} />
                            <Box component="span" pr={2}>
                                ??????
                            </Box>
                        </Stack>
                    </Tooltip>
                    <Button variant="contained" onClick={handleClickPublishButton}>
                        ????????????
                    </Button>
                </Stack>
                <Stack direction="row" justifyContent="flex-end" alignItems="center">
                    <Tooltip title="URL????????????">
                        <IconButton onClick={handleCopy}>
                            <ContentCopy />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Twitter????????????">
                        <Box p={1}>
                            <TwitterShareButton
                                url={profUrl}
                                hashtags={["????????????????????????"]}
                                title={`${name} ???????????? \n\n`}
                            >
                                <TwitterIcon size={32} round />
                            </TwitterShareButton>
                        </Box>
                    </Tooltip>
                </Stack>
            </Container>
            <UtilDialog {...confirmGotoProfPageDialog.dialogProps}>
                <DialogTitle>
                    ?????????????????????????????????????????????
                </DialogTitle>
                <DialogContent>
                    <Alert severity='error'>
                        ?????????????????????????????????????????????????????????????????????????????????????????????
                        ??????????????????????????????????????????????????????
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button variant='text' onClick={confirmGotoProfPageDialog.hide}>
                        ???????????????
                    </Button>
                    <Button variant='contained' onClick={gotoProfPage}>
                        ????????????????????????????????????
                    </Button>
                </DialogActions>
            </UtilDialog>
        </LayoutContent>
    );
})


interface FooterSectionProps {
}
const FooterSection: FC<FooterSectionProps> = () => {
    return (
        <LayoutContent bgcolor="background.paper" minHeight="50vh" position="relative">
            <Box sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                padding: 2,
            }}>
                <Fab color="primary" href="#">
                    <KeyboardArrowUp />
                </Fab>
            </Box>
        </LayoutContent>
    );
}

interface FixedProps {
    onSave: () => void
}
const Fixed: FC<FixedProps> = ({
    onSave,
}) => {
    return (
        <>
            <Fab
                color="primary"
                onClick={onSave}
                sx={{ position: "fixed", margin: 2, bottom: 0, right: 0, }}
            >
                <Save />
            </Fab>
        </>
    );
}

interface DangerousSectionProps {
    onDeleteProf: () => void
}
const DangerousSection: FC<DangerousSectionProps> = ({
    onDeleteProf,
}) => {
    const deleteConfirmDialog = useUtilDialog()
    const handleDelete = onDeleteProf
    return (
        <>
            <LayoutContent bgcolor="background.paper">
                <Box
                    border="dashed 2px"
                    borderColor={t => t.palette.error.main}
                    p={2}
                    borderRadius={2}
                    bgcolor={t => t.palette.grey[100]}
                >
                    <Grid
                        container
                        spacing={2}
                    >
                        <Grid item xs={12} md="auto">
                            <Button variant='contained' color="error" onClick={deleteConfirmDialog.show}>
                                ????????????????????????
                            </Button>
                        </Grid>
                        <Grid item xs>
                            ???????????????????????????????????????????????????????????????????????????
                        </Grid>
                    </Grid>
                </Box>
            </LayoutContent>
            <UtilDialog {...deleteConfirmDialog.dialogProps}>
                <DialogTitle color="error">
                    ??????????????????????????????
                </DialogTitle>
                <DialogContent>
                    ???????????????????????????????????????
                </DialogContent>
                <DialogActions>
                    <Button variant='text' color="inherit" onClick={deleteConfirmDialog.hide}>???????????????</Button>
                    <Button variant='contained' color='error' onClick={handleDelete}>??????</Button>
                </DialogActions>
            </UtilDialog>
        </>
    );
}
