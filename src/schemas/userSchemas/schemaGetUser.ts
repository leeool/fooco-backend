import { z } from "zod"

const schemaGetUser = z.object({
  params: z.object({
    user_id: z.string().uuid("ID de usuário inválido")
  })
})

const paramsShape = schemaGetUser.shape.params

declare global {
  type getUserParamsTypes = z.infer<typeof paramsShape>
}

export default schemaGetUser
