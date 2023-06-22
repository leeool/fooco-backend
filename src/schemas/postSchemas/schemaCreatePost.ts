import { z } from "zod"

const schemaCreatePost = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(4, "Seu título é muito curto!")
      .max(80, "Seu título é muito longo!"),
    content: z
      .string()
      .trim()
      .min(20, "O conteúdo do seu post é muito curto!")
      .max(5000, "O conteúdo do seu post é muito longo!"),
    user_id: z.string().trim().uuid("Formato de ID inválido"),
    tags: z
      .array(z.string().max(20, "Tag muito longa"))
      .max(8, "Limite de tags atingido")
      .optional(),
    group_id: z.string().trim().uuid("Formato de ID inválido").optional()
  })
})

export const createPostShape = schemaCreatePost.shape.body

declare global {
  type createPostTypes = z.infer<typeof createPostShape>
}

export default schemaCreatePost
