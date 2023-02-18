import { z } from "zod"

export const ThemeTypeSchema = z.union([
    z.literal("bad"),           // ダサい
    z.literal("fashionable"),   // おしゃれ
    z.literal("json"),          // json
])
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

export const ProfItemSchema = z.object({
    name: z.string(),
    value: z.union([
        z.number(),
        z.string(),
        z.boolean(),
    ]),
    comment: z.string(),
    appeal: z.boolean(),
})
export type ProfItem = z.infer<typeof ProfItemSchema>

export const ProfSchema = z.object({
    profId: z.string(),
    name: z.string(),
    icon: z.string(),
    freeSpace: z.string(),
    skills: z.array(SkillSchema),
    profItems: z.array(ProfItemSchema),
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

