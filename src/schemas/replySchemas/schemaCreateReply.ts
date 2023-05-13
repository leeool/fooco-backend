import { z } from "zod"

const schemaCreateReply = z.object({
  body: z.object({
    content: z
      .string()
      .trim()
      .min(1, "Sua resposta está muito curta!")
      .max(1000, "Sua resposta é muito longa!"),
    user_id: z.string().trim().uuid("ID de usuário inválido")
  }),
  params: z.object({
    post_id: z.string().trim().uuid("ID de publicação inválido")
  })
})

const createReplyShape = schemaCreateReply.shape.body
const createReplyParamsShape = schemaCreateReply.shape.params

declare global {
  type createReplyTypes = z.infer<typeof createReplyShape>
  type createReplyParamsTypes = z.infer<typeof createReplyParamsShape>
}
