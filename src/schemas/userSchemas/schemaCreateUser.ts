import { z } from "zod"
const regexAtLeastOneNumber = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{1,})$/

const schemaCreateUser = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email({
        message: "Formtado de e-mail inválido"
      })
      .nullish(),
    username: z
      .string()
      .trim()
      .min(4, "Seu apelido é muito curto!")
      .max(20, "Seu apelido é muito longo!")
      .nullish(),
    password: z
      .string()
      .trim()
      .min(8, "A Senha deve ter no mínimo 8 caracteres")
      .regex(regexAtLeastOneNumber, "A senha deve conter números e letras")
      .nullish()
  })
})

const createUserShape = schemaCreateUser.shape.body

declare global {
  type createUserTypes = z.infer<typeof createUserShape>
}

export default schemaCreateUser
