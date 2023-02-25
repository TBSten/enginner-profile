import { Firestore } from "@google-cloud/firestore"
import { credentials, gcpProjectId } from "./gcp"

const getFirestoreDb = () => {
    try {
        return new Firestore({
            projectId: gcpProjectId,
            credentials,
        })
    } catch (e) {
        console.error("error")
        console.error(e)
        console.error("PROJECT_ID", gcpProjectId)
        console.error("credentials", credentials)
        throw e
    }
}

export const db = getFirestoreDb()
