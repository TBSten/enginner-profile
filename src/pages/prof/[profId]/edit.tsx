import ColorPicker from '@/components/ColorPicker';
import BaseLayout from '@/components/layout/BaseLayout';
import LayoutContent from '@/components/layout/LayoutContent';
import { chooseFile } from '@/lib/client/file';
import { useLoading } from '@/lib/client/loading';
import { getLocal, saveLocal } from '@/lib/client/saveLocal';
import { getProf } from '@/lib/server/prof';
import { Assessment, Prof, ProfItem, ProfSchema, Skill } from '@/types';
import { Add, Delete, MoreVert } from '@mui/icons-material';
import { Alert, Box, Button, CircularProgress, Container, Divider, Grid, IconButton, InputBase, Menu, MenuItem, Select, SelectProps, Stack, Switch, useTheme } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { z } from 'zod';

const LOCAL_PROF_KEY = "enginner_profile_local_prof"

interface Props {
    prof: Prof
}
const ProfDetailPage: NextPage<Props> = ({ prof: defaultProf }) => {
    const [prof, setProf] = useState(defaultProf)
    const handleSave = useCallback(async () => {
        // TODO save prof
        saveLocal(LOCAL_PROF_KEY, prof)
        await fetch(`/api/prof/${prof.profId}`, {
            method: "PUT",
            body: JSON.stringify(prof),
        })
    }, [prof])
    useEffect(() => {
        const saveData = getLocal(LOCAL_PROF_KEY)
        if (saveData === null) { return }
        const savedProf = ProfSchema.parse(saveData)
        setProf(savedProf)
    }, [])

    const handleChangeName =
        useCallback((name: string) => setProf(p => ({ ...p, name })), [])
    const handleChangeFreeSpace =
        useCallback((freeSpace: string) => setProf(p => ({ ...p, freeSpace })), [])
    const handleChangeIcon =
        useCallback((icon: string) => setProf(p => ({ ...p, icon })), [])
    const handleChangeColor =
        useCallback((color: string) => setProf(p => ({ ...p, theme: { ...p.theme, color } })), [])
    const handleChangeSkills: SkillsSectionProps["onChangeSkills"] =
        useCallback(updater => setProf(p => ({ ...p, skills: updater(p.skills) })), [])
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
                <ColorSelectSection
                    color={prof.theme.color}
                    onChange={handleChangeColor}
                />
                <SillsSection
                    skills={prof.skills}
                    onChangeSkills={handleChangeSkills}
                />
                <ProfItemsSection
                    profItems={prof.profItems}
                    onChangeProfItems={handleChangeProfItems}
                />
                <Divider />
                <OutputSection
                    profId={prof.profId}
                    publish={prof.publish}
                    onChangePublish={handleChangePublich}
                    onSave={handleSave}
                />
            </BaseLayout>
        </>
    );
}
export default ProfDetailPage;


export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
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
        console.log("choosed file", file)
        withUpload(async () => {
            const res = await fetch(`/api/image/upload`).then(r => r.json())
            const { uploadUrl, publicUrl } = UploadUrlResSchema.parse(res)
            await fetch(uploadUrl, {
                method: "PUT",
                body: file,
            })
            console.log("success upload", file)
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

interface ColorSelectSectionProps {
    color: string
    onChange: (color: string) => void
}
const ColorSelectSection: FC<ColorSelectSectionProps> = React.memo(function ColorSelectSection({
    color, onChange,
}) {
    // const [color, setColor] = useState<string>(defaultColor[1])
    const [openColorPicker, setOpenColorPicker] = useState(false);
    return (
        <LayoutContent>
            <Stack direction="column" justifyContent="center" alignItems="center">
                <ColorPicker
                    color={color}
                    onChange={(color) => onChange(color)}
                    open={openColorPicker}
                    onOpen={() => setOpenColorPicker(true)}
                    onClose={() => setOpenColorPicker(false)} />
            </Stack>
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
    onChangeSkills: (updater: ((p: Skill[]) => Skill[])) => void
}
const SillsSection: FC<SkillsSectionProps> = React.memo(function SillsSection({ skills, onChangeSkills }) {
    console.log("skills render")
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
            {skills.map((skill, idx) => <Box key={idx} py={0.5}>
                <EditableSkill
                    skill={skill}
                    onChangeName={handleChangeName(idx)}
                    onChangeComment={handleChangeComment(idx)}
                    onChangeAssessment={handleChangeAssessment(idx)}
                    onChangeAppeal={handleChangeAppeal(idx)}
                    onDelete={handleDelete(idx)} />
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
}
const EditableSkill: FC<EditableSkillProps> = React.memo(function EditableSkill({
    skill, onChangeName, onChangeComment, onChangeAssessment, onChangeAppeal, onDelete,
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
    const handleDelete = () => {
        setOpenMenu(false);
        onDelete();
    };
    return (
        <Grid container width="100%" p={1} sx={t => ({ bgcolor: t.palette.background.paper })}>
            <Grid item xs="auto" px={1}>
                {/* TODO SKILL ICON */}
                #
            </Grid>
            <Grid item xs sm px={1}>
                <InputBase
                    value={skill.name}
                    onChange={e => onChangeName(e.target.value)}
                    fullWidth
                    placeholder='スキル名を入力' />
            </Grid>
            <Grid item xs={12} sm px={1}>
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
            <Grid item xs={8} sm="auto" px={1}>
                <Stack direction={{ xs: "row-reverse", md: "column" }} alignItems="center" color="primary">
                    <Box>アピール</Box>
                    <Switch
                        checked={skill.appeal}
                        onChange={(e, newValue) => onChangeAppeal(newValue)} />
                </Stack>
            </Grid>
            <Grid item xs={4} sm="auto" px={1}>
                <Stack direction="row" justifyContent={{ xs: "flex-end", md: "start" }} alignItems="center">
                    <IconButton onClick={() => setOpenMenu(true)} ref={btnRef}>
                        <MoreVert />
                    </IconButton>
                    <Menu open={openMenu} onClose={() => setOpenMenu(false)} anchorEl={btnRef.current}>
                        <MenuItem onClick={handleDelete}>
                            <Delete />
                            削除
                        </MenuItem>
                    </Menu>
                </Stack>
            </Grid>
        </Grid>
    );
})

const defaultProfItem = (): ProfItem => ({
    name: "趣味",
    value: "ギター",
    comment: "",
    appeal: false,
})
interface ProfItemsSectionProps {
    profItems: ProfItem[]
    onChangeProfItems: (updater: ((p: ProfItem[]) => ProfItem[])) => void
}
const ProfItemsSection: FC<ProfItemsSectionProps> = React.memo(function ProfItemsSection({ profItems, onChangeProfItems }) {
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
            {profItems.map((profItem, idx) => <Box key={idx} py={0.5}>
                <EditableProfItem
                    profItem={profItem}
                    onChangeName={handleChangeProfItemName(idx)}
                    onChangeValue={handleChangeProfItemValue(idx)}
                    onChangeComment={handleChangeProfItemComment(idx)}
                    onChangeAppeal={handleChangeProfItemAppeal(idx)}
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
    onDelete: () => void
}
const EditableProfItem: FC<EditableProfItemProps> = React.memo(function EditableProfItem({ profItem, onChangeName, onChangeValue, onChangeComment, onChangeAppeal, onDelete, }) {
    const [openMenu, setOpenMenu] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);
    const handleDelete = () => {
        setOpenMenu(false);
        onDelete();
    };
    return (
        <Grid container p={1} sx={t => ({ bgcolor: t.palette.background.paper })}>
            <Grid item xs="auto" sm="auto" px={1}>
                <InputBase
                    value={profItem.name}
                    onChange={e => onChangeName(e.target.value)}
                    placeholder='項目名を入力'
                    fullWidth
                    sx={{ fontWeight: "bold" }} />
            </Grid>
            <Grid item xs={12} sm px={1}>
                <InputBase
                    value={profItem.value}
                    onChange={e => onChangeValue(e.target.value)}
                    placeholder='項目値を入力'
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm px={1}>
                <InputBase
                    value={profItem.comment}
                    onChange={e => onChangeComment(e.target.value)}
                    placeholder='コメントを入力'
                    fullWidth />
            </Grid>
            <Grid item xs={8} sm="auto" px={1}>
                <Stack direction="row" justifyContent={{ xs: "flex-end", md: "start" }} alignItems="center">
                    アピール
                    <Switch
                        checked={profItem.appeal}
                        onChange={(e, newValue) => onChangeAppeal(newValue)}
                        color="secondary" />
                </Stack>
            </Grid>
            <Grid item xs={4} sm="auto" px={1}>
                <Stack direction="row" justifyContent={{ xs: "flex-end", md: "start" }} alignItems="center">
                    <IconButton onClick={() => setOpenMenu(true)} ref={btnRef}>
                        <MoreVert />
                    </IconButton>
                    <Menu open={openMenu} onClose={() => setOpenMenu(false)} anchorEl={btnRef.current}>
                        <MenuItem onClick={handleDelete}>
                            <Delete />
                            削除
                        </MenuItem>
                    </Menu>
                </Stack>
            </Grid>
        </Grid>
    );
})

interface OutputSectionProps {
    profId: string
    publish: boolean
    onChangePublish: (publish: boolean) => void
    onSave: () => void
}
const OutputSection: FC<OutputSectionProps> = React.memo(function OutputSection({
    profId, publish, onChangePublish, onSave,
}) {
    const theme = useTheme();
    const handleClickPublishButton = () => {
        onSave();
    };
    return (
        <LayoutContent bgcolor={theme.palette.background.paper}>
            <Container maxWidth="sm">

                <Stack direction={{ xs: "column", md: "row" }} p={4} width="100%" justifyContent="space-between" spacing={2}>
                    <Button variant='contained' sx={{ px: 2, py: 3, borderRadius: "9999px" }} size='large' href={`/prof/${profId}`}>
                        自己紹介ページを表示
                    </Button>
                    <Button variant='contained' sx={{ px: 2, py: 3, borderRadius: "9999px" }} size='large' href={`/prof/${profId}/card`}>
                        カード形式で表示
                    </Button>
                </Stack>

                <Stack direction="row" justifyContent="flex-end" alignItems="center">
                    <Switch
                        checked={publish}
                        onChange={(_, newValue) => onChangePublish(newValue)} />
                    <Box component="span" pr={2}>
                        公開
                    </Box>
                    <Button variant="contained" onClick={handleClickPublishButton}>
                        保存する
                    </Button>
                </Stack>

            </Container>
        </LayoutContent>
    );
})
