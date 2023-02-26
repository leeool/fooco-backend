import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { UnauthorizedError } from "../helpers/apiErrors"

declare global {
  interface JWTPayload {
    id: string
  }
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
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

export default auth
