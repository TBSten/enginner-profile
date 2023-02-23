import { getRandomColor } from "@/styles/color";
import { Prof, ProfSchema } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firestore";

export const profs = db.collection("profs")

const getDefaultProf = (profId: string, authorId: string | null): Prof => ({
    profId,
    version: "1.0",
    authorId,
    name: "あなたの名前",
    freeSpace: "",
    icon: "https://storage.googleapis.com/enginner-prof-user-images/default-icon-1",
    skills: [],
    profItems: [],
    publish: false,
    createAt: Date.now(),
    updateAt: Date.now(),
    theme: {
        type: "fashionable",
        color: getRandomColor()[1],
    },
    publishAt: null,
})

export const addNewProf = async (input: Partial<Prof>, authorId: string | null): Promise<Prof> => {
    const profId = uuidv4()
    const prof: Prof = {
        ...getDefaultProf(profId, authorId),
        ...input,
    }
    await profs.doc(profId).set(prof)
    return prof
}
export const addProfFromTemplate = async (templateProfId: string, input: Partial<Prof>, authorId: string | null): Promise<Prof> => {
    const profId = uuidv4()
    const templateProf = await getProf(templateProfId)
    const defaultProf = getDefaultProf(profId, authorId)
    const prof: Prof = {
        ...defaultProf,
        ...templateProf,
        // IDと名前はテンプレートの値を使用しない
        profId: defaultProf.profId,
        name: defaultProf.name,
        // 残りは入力をもとに上書き
        ...input,
    }
    await profs.doc(profId).set(prof)
    return prof
}

export const getProf = async (profId: string): Promise<Prof | null> => {
    const snapshot = await profs.doc(profId).get()
    if (!snapshot.exists) return null
    const prof = ProfSchema.parse(snapshot.data())
    return prof
}

export const updateProf = async (profId: string, input: Partial<Prof>): Promise<void> => {
    const prof: Partial<Prof> = {
        ...input,
        updateAt: Date.now(),
    }
    if (prof.publish) {
        prof.publishAt = Date.now()
    }
    await profs.doc(profId).set(prof, { merge: true })
}

