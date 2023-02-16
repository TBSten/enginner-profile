import { Prof } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { db } from "./firestore";

const profs = db.collection("profs")

export const addNewProf = async (name: string): Promise<Prof> => {
    const profId = uuidv4()
    const prof: Prof = {
        profId,
        name,
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
    }
    await profs.doc(profId).set(prof)
    return prof
}