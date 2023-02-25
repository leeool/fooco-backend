import { NextFunction, Request, response, Response } from "express"
import jwt from "jsonwebtoken"
import { And, Equal } from "typeorm"
import { UnauthorizedError } from "../helpers/apiErrors"
import userRepository from "../repositories/userRepository"

interface JWTPayload {
  id: string
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers

  if (!authorization) {
    throw new UnauthorizedError("Token não encontrado.")
  }

  const token = authorization.split(" ")[1]

  jwt.verify(token, process.env.JWT_PASS!, (err, decoded) => {
    if (err) {
      throw new UnauthorizedError("Usuário não autorizado.")
    } else {
      next()
    }
  })
}
