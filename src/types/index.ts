import { z } from "zod"

export const themeTypes = [
    "bad",          // ダサい
    "fashionable",  // おしゃれ
    "files",        // json,csvなどのファイル
] as const
export const ThemeTypeSchema = z.enum(themeTypes)
export type ThemeType = z.infer<typeof ThemeTypeSchema>
export const AssessmentSchema = z.object({
    value: z.number(),
    comment: z.string(),
})
export type Assessment = z.infer<typeof AssessmentSchema>


export const SkillSchema = z.object({
    name: z.string(),
    comment: z.string(),
    assessment: AssessmentSchema,
    appeal: z.boolean(),
})
export type Skill = z.infer<typeof SkillSchema>

export const ProfItemValueSchema = z.union([
    z.object({
        type: z.literal("text"),
        text: z.string(),
    }),
    z.object({
        type: z.literal("link"),
        link: z.string(),
    }),
])
export type ProfItemValue = z.infer<typeof ProfItemValueSchema>
export const ProfItemSchema = z.object({
    name: z.string(),
    value: ProfItemValueSchema,
    comment: z.string(),
    appeal: z.boolean(),
})
export type ProfItem = z.infer<typeof ProfItemSchema>

export const ProfSchema = z.object({
    profId: z.string(),
    version: z.string(),
    name: z.string(),
    authorId: z.string(),
    icon: z.string(),
    freeSpace: z.string(),
    skills: z.array(SkillSchema),
    skillComment: z.string().nullable(),
    profItems: z.array(ProfItemSchema),
    profItemComment: z.string().nullable(),
    theme: z.object({
        type: ThemeTypeSchema,
        color: z.string(),
    }),
    publish: z.boolean(),
    createAt: z.number(),
    updateAt: z.number(),
    publishAt: z.number().nullable(),
})
export type Prof = z.infer<typeof ProfSchema>

export const GoodToProfSchema = z.object({
    profId: z.string(),
    senderId: z.string(),
    createAt: z.number(),
})
export type GoodToProf = z.infer<typeof GoodToProfSchema>

export const UserSchema = z.object({
    userId: z.string(),
    type: z.enum(["anonymous", "normal"]),
    name: z.string(),
})
export type User = z.infer<typeof UserSchema>
