import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { And, Equal } from "typeorm"
import { UnauthorizedError } from "../helpers/apiErrors"
import userRepository from "../repositories/userRepository"

interface JWTPayload {
  id: string
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers
  const { userId } = req.params
  const { user_id } = req.body

  if (!authorization) {
    throw new UnauthorizedError("Token não encontrado.")
  }

  const token = authorization.split(" ")[1]

  const { id } = jwt.verify(token, process.env.JWT_PASS!) as JWTPayload

  const user = await userRepository.findOne({
    where: { id: And(Equal(userId || user_id), Equal(id)) }
  })

  if (!user) {
    throw new UnauthorizedError("Usuário não autorizado.")
  }

  next()
}
