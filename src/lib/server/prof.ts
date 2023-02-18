import { defaultColor } from "@/styles/color";
import { Prof, ProfSchema } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { db } from "./firestore";

const profs = db.collection("profs")

export const addNewProf = async (input: Partial<Prof>): Promise<Prof> => {
    const profId = uuidv4()
    const prof: Prof = {
        profId,
        name: "名無しユーザ",
        freeSpace: "",
        icon: "",
        skills: [],
        profItems: [],
        publish: false,
        createAt: Date.now(),
        updateAt: Date.now(),
        theme: {
            type: "fashionable",
            color: defaultColor[1],
        },
        publishAt: null,
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

