import { z } from "zod"

const schemaGetUser = z.object({
  params: z.object({
    username: z.string().min(4, "Usuário Inválido")
  })
})

const paramsShape = schemaGetUser.shape.params

declare global {
  type getUserParamsTypes = z.infer<typeof paramsShape>
}

export default schemaGetUser
