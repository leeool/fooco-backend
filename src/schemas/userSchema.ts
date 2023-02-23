import { z } from "zod"

const regexAtLeastOneNumber = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{1,})$/

const userSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email({
        message: "Email inválido"
      })
      .optional(),
    username: z
      .string()
      .trim()
      .min(4, "Nome de usuário muito curto")
      .max(20, "Nome de usuário muito longo")
      .optional(),
    password: z
      .string()
      .trim()
      .min(8, "A Senha deve ter no mínimo 8 caracteres")
      .regex(regexAtLeastOneNumber, "A senha deve conter ao menos um número")
      .optional()
  })
})

export default userSchema
