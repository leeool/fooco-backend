import { Request, Response } from "express"
import { UnauthorizedError } from "../helpers/apiErrors"
import jwt from "jsonwebtoken"
import userRepository from "../repositories/userRepository"

class tokenController {
  validadeToken(req: Request, res: Response) {
    const { authorization } = req.headers

    if (!authorization) {
      throw new UnauthorizedError("Token inválido.")
    }

    const token = authorization.split(" ")[1]

    jwt.verify(token, process.env.JWT_PASS!, async (err, decoded) => {
      if (err || !decoded || typeof decoded === "string" || !("id" in decoded))
        throw new UnauthorizedError("Token inválido.")

      const user = await userRepository.findOne({
        where: { id: decoded.id },
        relations: { savedPosts: true }
      })

      if (!user) throw new UnauthorizedError("Token inválido.")

      return res.status(200).json({ decoded, user })
    })
  }
}

export default new tokenController()
