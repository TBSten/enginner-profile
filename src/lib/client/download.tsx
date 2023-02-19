export const downloadAsTextFile = async (fileName: string, fileType: string, content: string) => {
    const blob = new Blob([content], { type: fileType })
    const aEl = document.createElement("a")
    aEl.href = URL.createObjectURL(blob)
    aEl.target = "_blank"
    aEl.download = fileName
    aEl.click()
    URL.revokeObjectURL(aEl.href)
}