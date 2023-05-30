import { z } from "zod"

const schemaUpdatePost = z.object({
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
      .array(z.string().trim().max(20, "Tag muito longa"))
      .max(8, "Limite de tags atingido")
      .optional()
  }),
  params: z.object({
    post_id: z.string().trim().uuid("Formato de ID inválido")
  })
})

const updatePostShape = schemaUpdatePost.shape.body
const updatePostParamsShape = schemaUpdatePost.shape.params

declare global {
  type updatePostTypes = z.infer<typeof updatePostShape>
  type updatePostParamsTypes = z.infer<typeof updatePostParamsShape>
}

export default schemaUpdatePost
