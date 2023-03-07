import { Request, Response } from "express"
import { UnauthorizedError } from "../helpers/apiErrors"
import jwt from "jsonwebtoken"

class tokenController {
  validadeToken(req: Request, res: Response) {
    const { authorization } = req.headers

    if (!authorization) {
      throw new UnauthorizedError("Token não encontrado.")
    }

    const token = authorization.split(" ")[1]

    jwt.verify(token, process.env.JWT_PASS!, (err, decoded) => {
      if (err) throw new UnauthorizedError("Token inválido.")
      return res.status(200).json(decoded)
    })
  }
}

export default new tokenController()
