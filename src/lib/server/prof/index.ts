import { getRandomColor } from "@/styles/color";
import { Prof, ProfSchema } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firestore";
import { getUser } from "../user";

export const profs = db.collection("profs")

const getDefaultProf = async (profId: string, authorId: string): Promise<Prof> => {
    const author = await getUser(authorId)
    if (!author) throw new Error(`not implement by not exists user : userId:${authorId}`)
    let dateAfter30Days = new Date()
    dateAfter30Days.setMonth(dateAfter30Days.getMonth() + 1)
    const expireAt = author.type === "normal"
        ? null
        : dateAfter30Days.valueOf() // 30 日間の有効期限
    return ({
        profId,
        version: "1.0",
        authorId,
        name: "あなたの名前",
        freeSpace: "",
        slug: profId,
        icon: "https://storage.googleapis.com/enginner-prof-app-images/default-1.png",
        images: [],
        skills: [],
        skillComment: null,
        profItems: [],
        profItemComment: null,
        publish: false,
        createAt: Date.now(),
        updateAt: Date.now(),
        theme: {
            type: "basic",
            color: getRandomColor()[1],
        },
        publishAt: null,
        expireAt,
    })
}

export const addNewProf = async (input: Partial<Prof>, authorId: string): Promise<Prof> => {
    const profId = uuidv4()
    const prof: Prof = {
        ...(await getDefaultProf(profId, authorId)),
        ...input,
    }
    await profs.doc(profId).set(prof)
    return prof
}
export const addProfFromTemplate = async (templateProfId: string, input: Partial<Prof>, authorId: string): Promise<Prof> => {
    const profId = uuidv4()
    const templateProf = await getProf(templateProfId)
    const defaultProf = await getDefaultProf(profId, authorId)
    const prof: Prof = {
        ...defaultProf,
        ...templateProf,
        // IDと名前はテンプレートの値を使用しない
        profId: defaultProf.profId,
        name: defaultProf.name,
        // 残りは入力をもとに上書き
        ...input,
        authorId,
    }
    await profs.doc(profId).set(prof)
    return prof
}

export const getProf = async (profIdOrSlug: string): Promise<Prof | null> => {
    const snapshot = await profs.doc(profIdOrSlug).get()
    if (!snapshot.exists) {
        // slugで検索
        return await getProfBySlug(profIdOrSlug)
    }
    const prof = ProfSchema.parse(snapshot.data())
    if (prof.expireAt && prof.expireAt >= Date.now()) return null
    return prof
}

export const getProfBySlug = async (slug: string): Promise<Prof | null> => {
    const snapshot = await profs.where("slug", "==", slug).get()
    if (snapshot.docs.length !== 0) return null
    if (snapshot.docs.length >= 2) throw new Error(`prof slug is duplicate : slug=${slug}`)
    const prof = ProfSchema.parse(snapshot.docs[0])
    if (prof.expireAt && prof.expireAt >= Date.now()) return null
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

export const getProfsByUser = async (userId: string) => {
    const snapshot = await profs
        .where("authorId", "==", userId)
        .orderBy("createAt", "desc")
        .get()
    return snapshot.docs.map(doc =>
        ProfSchema.parse(doc.data())
    )
}

export const hasViewPermission = async (userId: string, prof: Prof) => {
    return userId === prof.authorId || prof.publish
}
export const hasEditPermission = async (userId: string, prof: Prof) => {
    return userId === prof.authorId
}
