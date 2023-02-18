import { Storage } from "@google-cloud/storage"
import { credentials, gcpProjectId } from "./gcp"

export const storage = new Storage({
    projectId: gcpProjectId,
    credentials,
})