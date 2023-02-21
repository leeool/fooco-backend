import { Request, Response } from "express"
import postRepository from "../repositories/postRepository"
import userRepository from "../repositories/userRepository"

class UserController {
  async index(req: Request, res: Response) {
    const users = await userRepository.find({ relations: { posts: true } })

    res.status(200).json(users)
  }

  async show(req: Request, res: Response) {
    const { id } = req.params

    const user = await userRepository.findOne({
      relations: { posts: true },
      where: { id: id }
    })

    if (!user) {
      return res.status(400).json({ error: "User not found" })
    }

    res.json({ user })
  }

  async store(req: Request, res: Response) {
    // criar usuário
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Por favor, preencha todos os campos." })
    }

    const newUser = userRepository.create({
      username,
      email,
      password
    })
    await userRepository.save(newUser)
    res.status(201).json(newUser)
  }

  async update(req: Request, res: Response) {
    const { id } = req.params
    const { username, email, password } = req.body

    let user = await userRepository.findOne({
      where: { id: id }
    })

    if (!user) {
      return res.status(400).json({ error: "User not found" })
    }

    const updatedUser = userRepository.create({
      ...user,
      username,
      email,
      password
    })

    await userRepository.update(id, updatedUser)

    user = await userRepository.findOne({
      where: { id: id },
      relations: { posts: true }
    })

    res.status(200).json(user)
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params

    const userExists = await userRepository.findOne({
      where: { id: id },
      relations: { posts: true }
    })

    if (!userExists) {
      return res.status(400).json({ error: "User not found" })
    }

    await postRepository.delete({ user: { id: id } })
    await userRepository.delete(id)

    res.status(200).json(userExists)
  }
}

export default new UserController()
