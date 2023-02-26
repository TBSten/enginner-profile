import { Prof, ProfItem, Skill } from "@/types";
import { Box, Button, Container, DialogActions, DialogContent, DialogTitle, Divider, Grid, Stack, Tooltip, alpha, useTheme } from "@mui/material";
import Image from "next/image";
import { FC, useState } from "react";
import Center from "../Center";
import UtilDialog, { useUtilDialog } from "../UtilDialog";
import { ProfViewComponentProps } from "./util";

type BasicProfViewProps = ProfViewComponentProps & {}
const BasicProfView: FC<BasicProfViewProps> = ({ prof }) => {
    return (
        <Box borderRadius="1rem" position="relative" overflow="hidden" sx={{ backgroundColor: alpha("#fff", 0.5) }}>
            <Overview prof={prof} />
            <ProfItems
                prof={prof}
            />
            <Images
                prof={prof}
            />
            <Divider />
            <Skills prof={prof} />
            <Divider />
        </Box>
    );
}

export default BasicProfView;


interface OverviewProps {
    prof: Prof
}
const Overview: FC<OverviewProps> = ({
    prof,
}) => {
    const theme = prof.theme
    const muiTheme = useTheme()
    return (
        <>
            <Center
                component="h1"
                m={0}
                p={0}
                px={1}
                fontSize={{ xs: "24px", md: "48px" }}
                bgcolor={theme.color}
                color={muiTheme.palette.getContrastText(theme.color)}
            >
                {prof.name}
            </Center>

            <Center px={4} py={1}>
                <Image
                    src={prof.icon}
                    alt={prof.name}
                    width={1200}
                    height={600}
                    priority
                    style={{
                        width: "50%",
                        maxWidth: "40vh",
                        height: "auto",
                        maxHeight: "40vh",
                        borderRadius: "9999%",
                        aspectRatio: "1 / 1",
                        objectFit: "cover",
                    }}
                />
            </Center>
            <Box px={2} pb={2}>
                <Center component={Container}>
                    {prof.freeSpace}
                </Center>
            </Box>
        </>
    );
}

const initShowCount = 6
interface SkillsProps {
    prof: Prof
}
const Skills: FC<SkillsProps> = ({ prof }) => {
    const theme = prof.theme
    const [showCount, setShowCount] = useState(initShowCount)
    const toggleShowCount = () => {
        setShowCount(p => p === initShowCount ? prof.skills.length : initShowCount)
    }
    const skills = prof.skills
        .sort((a, b) => {
            if (a.appeal && !b.appeal) return -1
            if (!a.appeal && b.appeal) return 1
            return b.assessment.value - a.assessment.value
        })
        .slice(0, showCount)
    const hasMore = prof.skills.length >= showCount
    return (
        <>
            <Box p={{ xs: 1, md: 4 }}>
                <Box component="h2" m={0} p={0}>
                    SKILL
                </Box>
                <Box p={1}>
                    <Grid container spacing={1}>
                        {skills.map((skill, i) =>
                            <Grid item xs={12} sm={6} xl={4} key={skill.name}>
                                <SkillRow
                                    key={skill.name}
                                    skill={skill}
                                    index={i}
                                    theme={theme}
                                />
                            </Grid>
                        )}
                        {hasMore &&
                            <Grid item xs={12}>
                                <Stack direction="row" justifyContent="flex-end">
                                    <Button variant="text" sx={{ color: theme.color, borderRadius: "9999px" }} onClick={toggleShowCount}>
                                        {showCount === initShowCount
                                            ? "もっと見る"
                                            : "一部を表示"
                                        }
                                    </Button>
                                </Stack>
                            </Grid>
                        }
                    </Grid>
                </Box>
            </Box>
        </>
    );
}


interface SkillRowProps {
    theme: Prof["theme"]
    skill: Skill
    index: number
}
const SkillRow: FC<SkillRowProps> = ({ theme, skill, index }) => {
    const muiTheme = useTheme()
    const isFill = index % 2 === 0
    const backgroundColor = isFill ? theme.color : muiTheme.palette.getContrastText(theme.color)
    const color = isFill ? muiTheme.palette.getContrastText(theme.color) : theme.color
    const borderColor = theme.color

    const detaiDialog = useUtilDialog()

    return (
        <>
            <Box
                key={skill.name}
                p={1}
                sx={{ backgroundColor, border: "solid 2px", borderColor, }}
                color={color}
                borderRadius="1rem"
                onClick={detaiDialog.show}
            >
                <Stack
                    fontWeight="bold"
                    direction={{ xs: "column", sm: "row" }}
                    flexWrap="wrap"
                    justifyContent="space-between"
                >
                    <Box>
                        {`${skill.name.slice(0, 20)}${skill.name.length >= 20 ? "..." : ""}`}
                    </Box>
                    <Box>
                        {"⭐️".repeat(skill.assessment.value + 1)}
                        {"☆".repeat(4 - skill.assessment.value - 1)}
                    </Box>
                </Stack>
            </Box>
            <UtilDialog {...detaiDialog.dialogProps}>
                <Box p={2} sx={{ fontSize: "1.5em", fontWeight: "bold", minWidth: "20vw" }}>
                    {
                        (skill.appeal ? "⭐️ " : "") +
                        skill.name
                    }
                </Box>
                <Box p={1}>
                    <Box>
                        {"評価: "}
                        <Box component="span" fontWeight="bold" fontSize="1.5em">
                            {Math.floor(skill.assessment.value * 100)}
                        </Box>
                        <Box component="span">
                            {" / 100"}
                        </Box>
                    </Box>
                    <Box px={1}>
                        {skill.assessment.comment}
                    </Box>
                </Box>
                <Divider flexItem />
                <Box p={2}>
                    {skill.comment}
                </Box>
                <DialogActions>
                    <Button variant="text" onClick={detaiDialog.hide}>
                        閉じる
                    </Button>
                </DialogActions>
            </UtilDialog>
        </>
    );
}


interface ProfItemsProps {
    prof: Prof
}
const ProfItems: FC<ProfItemsProps> = ({ prof }) => {
    const items = prof.profItems
    return (
        <Stack direction="column">
            <Box
                width="100%"
                overflow="auto"
                p={1}
                display="flex"
                flexDirection="row"
                flexWrap="wrap"
                justifyContent="center"
            >
                {items.map(item =>
                    <ProfItemView profItem={item} theme={prof.theme} key={item.name} />
                )}
            </Box>
        </Stack>
    );
}

interface ProfItemViewProps {
    profItem: ProfItem
    theme: Prof["theme"]
}
const ProfItemView: FC<ProfItemViewProps> = ({ profItem, theme }) => {
    const muiTheme = useTheme()
    const [openTooltip, setOpenTooltip] = useState(false)
    const detailDialog = useUtilDialog()

    // const content = profItem.value.type === "text"
    //     ? <Box fontSize="0.8em">
    //         {profItem.name}
    //         :
    //         <Box component="span" fontWeight="bold">{profItem.value.text}</Box>
    //     </Box>
    //     : <Link
    //         color="inherit"
    //         underline="hover"
    //         href={profItem.value.link}
    //         target="_blank"
    //         rel="noreferrer"
    //     >
    //         {profItem.name}
    //     </Link>
    const chipContent = profItem.value.type === "text"
        ? <Box fontSize="0.8em">
            {profItem.name}
            :
            <Box component="span" fontWeight="bold">{profItem.value.text}</Box>
        </Box>
        : <Box component="span" fontWeight="bold">{profItem.name}</Box>
    const detailContent = profItem.value.type === "text"
        ? <Box fontWeight="bold">{profItem.value.text}</Box>
        : <></>
    const detailsActions = profItem.value.type === "link"
        ? <Button variant="outlined" target="_blank" href={profItem.value.link}>
            リンクを開く
        </Button>
        : <></>
    return (
        <>
            <Tooltip
                title={profItem.comment}
                open={openTooltip}
                onOpen={() => setOpenTooltip(true)}
                onClose={() => setOpenTooltip(false)}
                leaveTouchDelay={Number.MAX_VALUE}
            >
                <Box
                    key={profItem.name}
                    p={0.5}
                    mr={1}
                    sx={{
                        width: "fit-content",
                        borderRadius: "0.5rem",
                        backgroundColor: theme.color,
                        color: muiTheme.palette.getContrastText(theme.color),
                        flexGrow: 0,
                        flexShrink: 0,
                        cursor: "pointer",
                        margin: "0.3rem",
                    }}
                    onClick={detailDialog.show}
                >{chipContent}</Box>
            </Tooltip>
            <UtilDialog {...detailDialog.dialogProps}>
                <DialogTitle>
                    {profItem.name}
                </DialogTitle>
                <DialogContent>
                    <Box fontSize="1.2em">
                        {detailContent}
                    </Box>
                    <Box>
                        {profItem.comment}
                    </Box>
                </DialogContent>
                <DialogActions>
                    {detailsActions}
                    <Button variant="text" onClick={detailDialog.hide}>
                        閉じる
                    </Button>
                </DialogActions>
            </UtilDialog>
        </>
    )
}

interface ImagesProps {
    prof: Prof
}
const Images: FC<ImagesProps> = ({ prof }) => {
    return (
        <Stack overflow="auto" width="100%" spacing={2} direction="row" flexWrap="nowrap" p={1}>
            {prof.images.map(img =>
                <Center key={img}>
                    <Image
                        key={img}
                        src={img}
                        alt=""
                        width={150}
                        height={150}
                        style={{ width: "150px", height: "auto" }}
                        priority
                    />
                </Center>
            )}
        </Stack>
    );
}
