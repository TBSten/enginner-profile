import { z } from "zod"

export const ThemeTypeSchema = z.union([
    z.literal("bad"),           // ダサい
    z.literal("fashionable"),   // おしゃれ
    z.literal("json"),          // json
])
export const ThemeColorSchema = z.union([
    z.literal("red"),
    z.literal("blue"),
])

export const SkillSchema = z.object({
    name: z.string(),
    comment: z.string(),
    assessment: z.object({
        value: z.number(),
        comment: z.string(),
    }),
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
        color: ThemeColorSchema,
    }),
    createAt: z.number(),
    updateAt: z.number(),
    publishAt: z.number().nullable(),
})
export type Prof = z.infer<typeof ProfSchema>

