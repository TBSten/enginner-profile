import { storage } from "./cloudStorage";

const userFileBucketName = process.env.GCS_USER_FILE_BUCKET_NAME as string
export const userFileBucket = storage.bucket(userFileBucketName)
