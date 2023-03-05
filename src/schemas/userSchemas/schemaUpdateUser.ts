import { z } from "zod"

const passwordRegex =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$!%*?&]?)[A-Za-z\d@$#!%*?&]{8,}$/

const schemaUpdateUser = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email({
        message: "Formatado de e-mail inválido"
      })
      .optional(),
    username: z
      .string()
      .trim()
      .min(4, "Seu apelido é muito curto!")
      .max(20, "Seu apelido é muito longo!")
      .optional(),
    password: z
      .string()
      .trim()
      .min(8, "A Senha deve ter no mínimo 8 caracteres")
      .regex(passwordRegex, "A senha deve conter números e letras")
      .optional(),
    tags: z.array(z.string()).optional(),
    educational_place: z.string().optional(),
    educational_place_url: z.string().url("Formato de URL inválida").optional(),
    about: z.string().max(100).optional(),
    avatar_url: z.string().url("Formato de URL Inválido").optional(),
    banner_url: z.string().url("Formato de URL inválido").optional()
  }),
  params: z.object({
    user_id: z.string().uuid("ID de usuário inválido")
  })
})

const updateUserBodyShape = schemaUpdateUser.shape.body
const updateUserParamsShape = schemaUpdateUser.shape.params

declare global {
  type updateUserTypes = z.infer<typeof updateUserBodyShape>

  type updateUserParamsTypes = z.infer<typeof updateUserParamsShape>
}

export default schemaUpdateUser
