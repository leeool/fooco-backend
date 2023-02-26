import { z } from "zod"

const schemaDeleteUser = z.object({
  params: z.object({
    user_id: z.string().uuid("ID de usuário inválido")
  })
})

const paramsShape = schemaDeleteUser.shape.params

declare global {
  type deleteUserParamsTypes = z.infer<typeof paramsShape>
}

export default schemaDeleteUser
