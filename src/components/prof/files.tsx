import { copyToClipboard } from "@/lib/client/copy";
import { downloadAsTextFile } from "@/lib/client/download";
import { Prof } from "@/types";
import { ContentCopy, Download, FiberNew } from "@mui/icons-material";
import { Box, Button, Paper, Snackbar, Stack, Tab, Tabs } from "@mui/material";
import { FC, useMemo, useState } from "react";
import YAML from "yaml";
import CodeHighlight from "../CodeHighlight";
import { ProfViewComponentProps } from "./util";

type ViewData = object
type ViewText = string

const types = {
    "json": {
        name: "json",
        contentType: "application/json",
        jp: "JSON",
    },
    "yaml": {
        name: "yaml",
        contentType: "application/yaml",
        jp: "Yaml",
    },
}

type FilesProfViewProps = ProfViewComponentProps & {}
const FilesProfView: FC<FilesProfViewProps> = ({ prof }) => {
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [type, setType] = useState(types["json"])
    const viewData = useMemo(() => profToViewData(prof), [prof])
    const viewText = viewDataToViewText(type.name, viewData)
    const copyViewData = async () => {
        await copyToClipboard(viewText)
        setOpenSnackbar(true)
    }
    const downloadViewText = async () => {
        const fileName = `${prof.name}-prof.${type.name}`
        await downloadAsTextFile(fileName, type.contentType, viewText)
    }
    return (
        <Paper>
            <Tabs value={type.name} onChange={(_, tab) => setType(types[tab as keyof typeof types])}>
                <Tab value="json" label="JSON" />
                <Tab value="yaml" label="Yaml" />
            </Tabs>
            <Stack direction="row" justifyContent="flex-end" flexWrap="wrap">
                <Button onClick={copyViewData} startIcon={<ContentCopy />}>コピー</Button>
                <Button onClick={downloadViewText} startIcon={<Download />}>ダウンロード</Button>
            </Stack>
            <Box>
                <CodeHighlight lang={type.name}>
                    {viewText}
                </CodeHighlight>
            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                message={`${type.jp}形式でコピーしました`}
            />
            <Stack direction="row" justifyContent="flex-end" flexWrap="wrap" p={2}>
                <Button variant="outlined" startIcon={<FiberNew />}>このプロフをもとにプロフを新規作成</Button>
            </Stack>
        </Paper>
    );
}

export default FilesProfView;


const profToViewData = (prof: Prof): ViewData => {
    const skills = prof.skills
        .sort((a, b) => {
            if (a.appeal && !b.appeal) return -1
            if (!a.appeal && b.appeal) return 1
            return b.assessment.value - a.assessment.value
        })
        .reduce((skills, skill) => {
            // skills[skill.name] = {
            //     assessment: `${skill.assessment.value}/4 (${skill.assessment.comment})`,
            //     comment: skill.comment,
            // }
            skills[skill.name] = `${skill.assessment.value}/4 (${skill.assessment.comment})`
            return skills
        }, {} as Record<string, unknown>)
    const items = prof.profItems
        .sort((a, b) => {
            if (a.appeal && !b.appeal) return -1
            if (!a.appeal && b.appeal) return 1
            return 0
        })
        .reduce((ans, item) => {
            if (item.value.type === "text") ans[item.name] = item.value.text
            if (item.value.type === "link") ans[item.name] = item.value.link
            return ans
        }, {} as Record<string, unknown>)
    const data = {
        name: prof.name,
        icon: prof.icon,
        details: prof.freeSpace,
        ...items,
        skills,
    }
    return data
}

const viewDataToViewText = (type: string, viewData: ViewData): ViewText => {
    if (type === "json") return JSON.stringify(viewData, null, 2)
    if (type === "yaml") return YAML.stringify(viewData)
    throw new Error(`invalid viewData type : ${type}`)
}
