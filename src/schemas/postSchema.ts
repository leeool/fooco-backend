import { z } from "zod"

const postSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(2, "Título muito curto")
      .max(50, "Título muito longo")
      .optional(),
    content: z
      .string()
      .min(10, "Conteúdo muito curto")
      .max(500, "Conteúdo muito longo")
      .optional(),
    user_id: z.string().uuid()
  })
})

export default postSchema
