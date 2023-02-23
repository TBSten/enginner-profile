
export const chooseFile = (accept?: string) => new Promise<File>((resolve, reject) => {
    const inputEl = document.createElement("input")
    inputEl.type = "file"
    if (accept) inputEl.accept = accept
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
