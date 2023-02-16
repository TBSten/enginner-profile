import { Prof } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const addNewProf = (name: string): Prof => {
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
    console.log("::TODO add prof", prof)
    return prof
}