import { z } from "zod"

const validUUID = z.object({
  params: z.object({
    userId: z.string().uuid("ID inválido").optional(),
    postId: z.string().uuid("ID inválido").optional()
  }),
  body: z.object({
    user_id: z.string().uuid("ID inválido").optional()
  })
})

export { validUUID }
