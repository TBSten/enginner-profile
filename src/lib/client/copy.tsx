export const copyToClipboard = async (text: string) => {
    if (!navigator.clipboard) {
        alert("コピーできませんでした")
        return
    }
    await navigator.clipboard.writeText(text)
}