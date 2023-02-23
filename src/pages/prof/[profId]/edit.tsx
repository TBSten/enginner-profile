import Center from '@/components/Center';
import ColorPicker from '@/components/ColorPicker';
import TextEditButton from '@/components/TextEditButton';
import ThemeTypePicker from '@/components/ThemeTypePicker';
import BaseLayout from '@/components/layout/BaseLayout';
import LayoutContent from '@/components/layout/LayoutContent';
import { copyToClipboard } from '@/lib/client/copy';
import { chooseFile } from '@/lib/client/file';
import { useLoading } from '@/lib/client/loading';
import { useResponsive } from '@/lib/client/responsive';
import { getLocal, saveLocal } from '@/lib/client/saveLocal';
import { getProf } from '@/lib/server/prof';
import { Assessment, Prof, ProfItem, ProfItemValue, ProfSchema, Skill, ThemeType } from '@/types';
import { Add, ContentCopy, Delete, Edit, KeyboardArrowUp, KeyboardDoubleArrowDown, KeyboardDoubleArrowUp, MoreVert, Save } from '@mui/icons-material';
import { Alert, Box, Button, CircularProgress, Container, Divider, Fab, Grid, IconButton, InputBase, ListItemIcon, Menu, MenuItem, Select, SelectProps, Snackbar, Stack, Switch, TextField, Tooltip, useTheme } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { FC, MouseEventHandler, useCallback, useEffect, useReducer, useRef, useState } from "react";
import { TwitterIcon, TwitterShareButton } from 'react-share';
import { z } from 'zod';

const LOCAL_PROF_KEY = "enginner_profile_local_prof"

interface Props {
    prof: Prof
}
const ProfDetailPage: NextPage<Props> = ({ prof: defaultProf }) => {
    const [prof, setProf] = useState(defaultProf)
    const [snackbarContent, setSnackbarContent] = useState<null | string>(null)
    useEffect(() => {
        const saveData = getLocal(LOCAL_PROF_KEY)
        if (saveData === null) { return }
        console.log(saveData);

        const savedProf = ProfSchema.parse(saveData)
        if (savedProf.profId === defaultProf.profId) {
            setProf(savedProf)
        } else {
            // 保存されたものを編集できない
            console.warn("can not save")
        }
    }, [defaultProf.profId])
    const handleSaveProf = useCallback(async () => {
        // TODO save prof
        saveLocal(LOCAL_PROF_KEY, prof)
        await fetch(`/api/prof/${prof.profId}`, {
            method: "PUT",
            body: JSON.stringify(prof),
        })
        setSnackbarContent("保存しました")
    }, [prof])

    const handleChangeName =
        useCallback((name: string) => setProf(p => ({ ...p, name })), [])
    const handleChangeFreeSpace =
        useCallback((freeSpace: string) => setProf(p => ({ ...p, freeSpace })), [])
    const handleChangeIcon =
        useCallback((icon: string) => setProf(p => ({ ...p, icon })), [])
    const handleChangeColor =
        useCallback((color: string) => setProf(p => ({ ...p, theme: { ...p.theme, color } })), [])
    const handleChangeThemeType =
        useCallback((type: ThemeType) => setProf(p => ({ ...p, theme: { ...p.theme, type } })), [])
    const handleChangeSkills: SkillsSectionProps["onChangeSkills"] =
        useCallback(updater => setProf(p => ({ ...p, skills: updater(p.skills) })), [])
    const handleChangeSkillComment =
        useCallback((skillComment: string) => setProf(p => ({ ...p, skillComment })), [])
    const handleChangeProfItemComment =
        useCallback((profItemComment: string) => setProf(p => ({ ...p, profItemComment })), [])
    const handleChangeProfItems: ProfItemsSectionProps["onChangeProfItems"] =
        useCallback(updater => setProf(p => ({ ...p, profItems: updater(p.profItems) })), [])
    const handleChangePublich: OutputSectionProps["onChangePublish"] =
        useCallback(publish => setProf(p => ({ ...p, publish })), [])

    return (
        <>
            <ProfDetailHead prof={prof} />
            <BaseLayout>
                <OverviewSection
                    name={prof.name}
                    freeSpace={prof.freeSpace}
                    icon={prof.icon}
                    onChangeName={handleChangeName}
                    onChangeFreeSpace={handleChangeFreeSpace}
                    onChangeIcon={handleChangeIcon}
                />
                <Divider />
                <ThemeEditSection
                    themeType={prof.theme.type}
                    onChangeThemeType={handleChangeThemeType}
                    color={prof.theme.color}
                    onChangeColor={handleChangeColor}
                />
                <SillsSection
                    skills={prof.skills}
                    skillComment={prof.skillComment}
                    onChangeSkills={handleChangeSkills}
                    onChangeSkillComment={handleChangeSkillComment}
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
        const id = ctx.query.profId as string
        const prof = await getProf(id)
        if (prof === null) {
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


interface ProfDetailHeadProps {
    prof: Prof
}
const ProfDetailHead: FC<ProfDetailHeadProps> = ({ prof }) => {
    return (
        <Head>
            <title>{`${prof.name}のプロフィール`}</title>
        </Head>
    );
}

const UploadUrlResSchema = z.object({
    publicUrl: z.string(),
    uploadUrl: z.string(),
})
interface OverviewProps {
    name: string
    freeSpace: string
    icon: string
    onChangeName: (name: string) => void
    onChangeFreeSpace: (freeSpace: string) => void
    onChangeIcon: (icon: string) => void
}
const OverviewSection: FC<OverviewProps> = ({ name, freeSpace, icon, onChangeName, onChangeFreeSpace, onChangeIcon }) => {
    const theme = useTheme()
    const [isUploading, withUpload] = useLoading()
    const handleUploadIcon = async () => {
        const file = await chooseFile()

        withUpload(async () => {
            const res = await fetch(`/api/image/upload`).then(r => r.json())
            const { uploadUrl, publicUrl } = UploadUrlResSchema.parse(res)
            await fetch(uploadUrl, {
                method: "PUT",
                body: file,
            })

            onChangeIcon(publicUrl)
        })
    }

    const iconSize = 100
    return (
        <LayoutContent bgcolor={theme.palette.background.paper}>
            <Grid container spacing={2} direction="row" alignItems="center">
                <Grid item xs={12} md="auto">
                    <Stack direction="column" alignItems="center" onClick={handleUploadIcon}>
                        <Box borderRadius={2} overflow="hidden" width={iconSize} height={iconSize}>
                            <Image
                                src={icon}
                                alt={name}
                                width={iconSize}
                                height={iconSize}
                                style={{ objectFit: "cover" }}
                            />
                            {isUploading &&
                                <CircularProgress />
                            }
                        </Box>
                        <Box component="span" textAlign="center" width={100} pt={1} fontSize="0.8em">
                            画像を <br />
                            アップロード
                        </Box>
                    </Stack>
                </Grid>
                <Grid item xs={12} md >
                    <InputBase
                        value={name}
                        onChange={e => onChangeName(e.target.value)}
                        fullWidth sx={{ fontSize: "3rem" }}
                        placeholder='あなたの名前'
                    />
                    <Divider />
                    <Box px={1}>
                        <InputBase
                            value={freeSpace}
                            onChange={e => onChangeFreeSpace(e.target.value)}
                            placeholder='自由入力欄'
                            fullWidth
                            minRows={5} maxRows={10} multiline
                        />
                    </Box>
                </Grid>
            </Grid>
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
        comment: "一つもない",
    },
    appeal: true,
})
interface SkillsSectionProps {
    skills: Skill[]
    skillComment: string
    onChangeSkills: (updater: ((p: Skill[]) => Skill[])) => void
    onChangeSkillComment: (comment: string) => void
}
const SillsSection: FC<SkillsSectionProps> = React.memo(function SillsSection({ skills, skillComment, onChangeSkills, onChangeSkillComment }) {
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
    return (
        <LayoutContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box fontWeight="bold" fontSize="1.5em" color={t => t.palette.primary.main}>
                    スキル
                </Box>
                <Box>
                    {skills.length}個のスキル
                </Box>
            </Stack>
            <Box>
                <TextField
                    value={skillComment} onChange={e => onChangeSkillComment(e.target.value)}
                    placeholder='スキルの説明を入力してください'
                    multiline rows={3}
                    fullWidth
                    color="primary"
                />
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
                        スキルが一つもありません。<br />
                        プログラミング言語やフレームワーク・ツールなどのスキルを追加してみましょう。
                    </Alert>
                </Box>}
            <Box px={1} py={1}>
                <Button variant='text' startIcon={<Add />} fullWidth sx={t => ({ border: `dashed 2px ${t.palette.primary.dark}` })} onClick={handleAddSkill} color="primary">
                    追加
                </Button>
            </Box>
        </LayoutContent>
    );
})

const assessments: Assessment["comment"][] = [
    "わからない/知らない",
    "助けがあればできる",
    "ひとりでできる",
    "人に教えられる",
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
    const handleChangeAssessment: SelectProps<number>["onChange"] = (e) => {
        const value = e.target.value as number;
        onChangeAssessment({
            value,
            comment: assessments[value],
        });
    };
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
                        placeholder='スキル名を入力'
                        sx={{ fontWeight: "bold" }}
                    />
                </Grid>
                <Grid item xs="auto" px={1}>
                    <Select
                        variant='standard'
                        value={skill.assessment.value}
                        onChange={handleChangeAssessment}
                        fullWidth
                    >
                        {assessments.map((assessment, idx) => <MenuItem key={assessment} value={idx}>
                            {"⭐️".repeat(idx + 1)}
                            {"☆".repeat(4 - idx - 1)}
                            {" "}
                            {assessment}
                        </MenuItem>
                        )}
                    </Select>
                </Grid>
                <Grid item xs="auto" px={1}>
                    <TextEditButton
                        icon={responsive(<><Edit /></>, <></>)}
                        label="コメントを入力"
                        value={skill.comment}
                        onChange={e => onChangeComment(e.target.value)}
                        placeholder='コメントを入力'
                        multiline rows={3}
                    />
                </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
                <Grid item xs="auto" px={1}>
                    <Stack direction="row" alignItems="center">
                        <Box>アピール</Box>
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
                                一つ上へ
                            </MenuItem>
                            <MenuItem onClick={handleMoveToDown}>
                                <ListItemIcon>
                                    <KeyboardDoubleArrowDown />
                                </ListItemIcon>
                                一つ下へ
                            </MenuItem>
                            <MenuItem onClick={handleDelete}>
                                <ListItemIcon>
                                    <Delete />
                                </ListItemIcon>
                                削除
                            </MenuItem>
                        </Menu>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
})

const defaultProfItem = (): ProfItem => ({
    name: "趣味",
    value: {
        type: "text",
        text: "ギター",
    },
    comment: "",
    appeal: false,
})
interface ProfItemsSectionProps {
    profItems: ProfItem[]
    onChangeProfItems: (updater: ((p: ProfItem[]) => ProfItem[])) => void
    profItemComment: string
    onChangeProfItemComment: (comment: string) => void
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
            // idxを一つ上へ
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
            // idxを一つ下へ
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
    return (
        <LayoutContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box fontWeight="bold" fontSize="1.5em" color={t => t.palette.secondary.main}>
                    自己紹介 項目
                </Box>
                <Box>
                    {profItems.length}個の項目
                </Box>
            </Stack>
            <Box>
                <TextField
                    value={profItemComment} onChange={e => onChangeProfItemComment(e.target.value)}
                    placeholder='自己紹介 項目 の説明を入力してください'
                    multiline rows={3}
                    fullWidth
                    color="secondary"
                />
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
                        項目が一つもありません<br />
                        趣味やSNSリンクなどの項目を追加してみましょう
                    </Alert>
                </Box>}
            <Box px={1} py={1}>
                <Button variant='text' startIcon={<Add />} fullWidth sx={t => ({ border: `dashed 2px ${t.palette.secondary.dark}` })} onClick={handleAddProfItem} color="secondary">
                    追加
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
                        placeholder='項目名を入力'
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
                        label="コメントを入力"
                        value={profItem.comment}
                        onChange={e => onChangeComment(e.target.value)}
                        placeholder='コメントを入力'
                        multiline rows={3}
                    />
                </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
                <Grid item xs="auto" px={1}>
                    <Stack direction="row" justifyContent={{ xs: "flex-end", md: "start" }} alignItems="center">
                        アピール
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
                                一つ上に移動
                            </MenuItem>
                            <MenuItem onClick={handleMoveToDown}>
                                <ListItemIcon>
                                    <KeyboardDoubleArrowDown />
                                </ListItemIcon>
                                一つ下に移動
                            </MenuItem>
                            <MenuItem onClick={handleDelete}>
                                <ListItemIcon>
                                    <Delete />
                                </ListItemIcon>
                                削除
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
                        placeholder={name + "を入力"}
                        fullWidth
                    />
                }
                {value.type === "link" &&
                    <InputBase
                        value={value.link}
                        onChange={e => onChange({ type: "link", link: e.target.value })}
                        placeholder={name + 'のリンクを入力'}
                        fullWidth
                    />
                }
            </Box>
            <IconButton ref={btnRef} color="secondary" onClick={() => setOpenMenu(true)}>
                <MoreVert />
            </IconButton>
            <Menu open={openMenu} onClose={() => setOpenMenu(false)} anchorEl={btnRef.current}>
                <MenuItem disabled>
                    タイプ
                </MenuItem>
                <Divider />
                <MenuItem
                    onClick={() => onChange({ type: "text", text: "" })}
                    disabled={value.type === "text"}
                >
                    テキスト
                </MenuItem>
                <MenuItem
                    onClick={() => onChange({ type: "link", link: "https://github.com/hogehoge" })}
                    disabled={value.type === "link"}
                >
                    リンク
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
}
const OutputSection: FC<OutputSectionProps> = React.memo(function OutputSection({
    profId, name,
    publish, onChangePublish, onSave,
    onSnackbarShow,
}) {
    const theme = useTheme();
    const handleClickPublishButton = async () => {
        await onSave();
        onSnackbarShow("保存しました")
    };
    const router = useRouter()
    const handleGotoProfPage: MouseEventHandler<HTMLAnchorElement> = async (e) => {
        e.preventDefault()
        const href = e.currentTarget.href
        await onSave()
        router.push(href)
    }

    const [loc, initLoc] = useReducer<() => Location | null>(() => location, null)
    useEffect(() => initLoc(), [])
    const profUrl = `${loc?.origin}/prof/${profId}`
    const handleCopy = async () => {
        await copyToClipboard(profUrl)
        onSnackbarShow("URLをコピーしました")
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
                        自己紹介ページを表示
                    </Button>
                    <Button
                        variant='contained'
                        sx={{ px: 2, py: 3, borderRadius: "9999px", textAlign: "center" }}
                        size='large'
                        href={`/prof/${profId}/card`}
                        onClick={onSave}
                    >
                        カード形式で表示
                    </Button>
                </Stack>

                <Stack direction="row" justifyContent="flex-end" alignItems="center" py={1}>
                    <Tooltip title="オンにするとあなた以外の人の人が自己紹介ページのURLを使ってあなたのプロフを見ることができます！">
                        <Stack direction="row" alignItems="center">
                            <Switch
                                checked={publish}
                                onChange={(_, newValue) => onChangePublish(newValue)} />
                            <Box component="span" pr={2}>
                                公開
                            </Box>
                        </Stack>
                    </Tooltip>
                    <Button variant="contained" onClick={handleClickPublishButton}>
                        保存する
                    </Button>
                </Stack>
                <Stack direction="row" justifyContent="flex-end" alignItems="center">
                    <Tooltip title="URLをコピー">
                        <IconButton onClick={handleCopy}>
                            <ContentCopy />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Twitterでシェア">
                        <Box p={1}>
                            <TwitterShareButton
                                url={profUrl}
                                hashtags={["エンジニアプロフ"]}
                                title={`${name} のプロフ \n\n`}
                            >
                                <TwitterIcon size={32} round />
                            </TwitterShareButton>
                        </Box>
                    </Tooltip>
                </Stack>
            </Container>
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

