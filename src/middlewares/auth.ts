import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { And, Equal } from "typeorm"
import userRepository from "../repositories/userRepository"

interface JWTPayload {
  id: string
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers
  const { userId } = req.params
  const { user_id } = req.body

  if (!authorization) {
    return res.status(401).json({ error: "Token not provided" })
  }

  const token = authorization.split(" ")[1]

  const { id } = jwt.verify(token, process.env.JWT_PASS!) as JWTPayload

  const user = await userRepository.findOne({
    where: { id: And(Equal(userId || user_id), Equal(id)) }
  })

  if (!user) {
    return res.status(401).json({ error: "Não autorizado" })
  }

  next()
}
