
export const gcpProjectId = process.env.GCP_PROJECT_ID
export const credentials = {
    client_email: process.env.GCP_SA_CLIENT_EMAIL,
    private_key: process.env.GCP_SA_PRIVATE_KEY?.replaceAll("\\n", "\n"),
} as const
