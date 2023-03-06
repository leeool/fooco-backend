import { z } from "zod"
const schemaCreatePost = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(4, "Seu título é muito curto!")
      .max(30, "Seu título é muito longo!"),
    content: z
      .string()
      .trim()
      .min(4, "O conteúdo do seu post é muito curto!")
      .max(200, "O conteúdo do seu post é muito longo!"),
    user_id: z.string().trim().uuid("Formato de ID inválido")
  })
})

const createPostShape = schemaCreatePost.shape.body

declare global {
  type createPostTypes = z.infer<typeof createPostShape>
}

export default schemaCreatePost
