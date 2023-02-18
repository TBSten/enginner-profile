
export const chooseFile = () => new Promise<File>((resolve, reject) => {
    const inputEl = document.createElement("input")
    inputEl.type = "file"
    inputEl.addEventListener("change", (e) => {
        const file = inputEl.files?.[0]
        if (file) {
            resolve(file)
        } else {
            reject()
        }
    })
    inputEl.click()
})
