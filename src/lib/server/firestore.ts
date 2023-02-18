import { Firestore } from "@google-cloud/firestore"
import { credentials, gcpProjectId } from "./gcp"

export const db = new Firestore({
    projectId: gcpProjectId,
    credentials,
})
