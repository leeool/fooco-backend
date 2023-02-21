import { Request, Response } from "express"
import userRepository from "../repositories/userRepository"

class UserController {
  async create(req: Request, res: Response) {
    // criar usuário
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Por favor, preencha todos os campos." })
    }

    const newUser = userRepository.create({
      username,
      email,
      password
    })
    await userRepository.save(newUser)
    res.status(201).json(newUser)
  }
}

export default new UserController()
