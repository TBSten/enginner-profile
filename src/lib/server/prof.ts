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
        createAt: new Date().valueOf(),
        updateAt: new Date().valueOf(),
        theme: {
            type: "fashionable",
            color: "red",
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

