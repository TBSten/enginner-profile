import { z } from "zod"

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

export const ProfScheme = z.object({
    name: z.string(),
    icon: z.string(),
    freeSpace: z.string(),
    skills: z.array(SkillSchema),
    profItems: z.array(ProfItemSchema),
    publish: z.boolean(),
    theme: z.object({
        type: z.union([
            z.literal("bad"),           // ダサい
            z.literal("fashionable"),   // おしゃれ
            z.literal("json"),          // json
        ]),
        color: z.string(),
    }),
    createAt: z.date(),
    updateAt: z.date(),
    publishAt: z.date(),
})
export type Prof = z.infer<typeof ProfScheme>

