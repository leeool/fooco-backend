import { Request, Response } from "express"
import postRepository from "../repositories/postRepository"
import userRepository from "../repositories/userRepository"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Equal, Not } from "typeorm"
import { BadRequestError, NotFoundError } from "../helpers/apiErrors"

class UserController {
  async index(req: Request, res: Response) {
    const users = await userRepository.find({
      relations: { posts: true }
    })

    res.status(200).json(users)
  }

  async show(req: Request, res: Response) {
    const { userId } = req.params

    const user = await userRepository.findOne({
      relations: { posts: { user: false } },
      where: { id: userId }
    })

    if (!user) {
      throw new NotFoundError("Usuário não encontrado.")
    }

    res.json(user)
  }

  async store(req: Request, res: Response) {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      throw new BadRequestError("Todos os campos são obrigatórios.")
    }

    const userExists = await userRepository.findOne({
      where: [{ username }, { email }]
    })

    if (userExists) {
      throw new BadRequestError("Email ou Username já cadastrado.")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = userRepository.create({
      username,
      email,
      password: hashedPassword
    })
    await userRepository.save(newUser)

    const { password: _, ...user } = newUser

    res.status(201).json(user)
  }

  async update(req: Request, res: Response) {
    const { userId } = req.params
    const { username, email, password } = req.body

    let user = await userRepository.findOne({
      where: { id: userId },
      select: { id: true, username: true, email: true, password: true }
    })

    if (!user) {
      throw new NotFoundError("Usuário não encontrado.")
    }

    const userExists = await userRepository.findOne({
      where: [
        { email: Equal(email), id: Not(userId) },
        { username: Equal(username), id: Not(userId) }
      ]
    })

    if (userExists) {
      throw new BadRequestError("Email ou Username já cadastrado.")
    }

    const updatedPassword = password
      ? await bcrypt.hash(password, 10)
      : user.password

    const updatedUser = userRepository.create({
      username,
      email,
      password: updatedPassword
    })
    await userRepository.update(userId, updatedUser)

    user = await userRepository.findOne({
      where: { id: userId },
      relations: { posts: true }
    })

    res.status(200).json(user)
  }

  async delete(req: Request, res: Response) {
    const { userId } = req.params

    const userExists = await userRepository.findOne({
      where: { id: userId },
      relations: { posts: true }
    })

    if (!userExists) {
      throw new NotFoundError("Usuário não encontrado.")
    }

    await postRepository.delete({ user: { id: userId } })
    await userRepository.delete(userId)

    res.status(200).json(userExists)
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body

    if (!email || !password) {
      throw new BadRequestError("Todos os campos são obrigatórios.")
    }

    const user = await userRepository.findOne({
      where: [{ email: email }, { username: email }],
      select: ["password", "id", "username", "email"]
    })

    if (!user) {
      throw new BadRequestError("Email ou senha inválidos.")
    }

    const verifiedPassword = await bcrypt.compare(password, user.password)

    if (!verifiedPassword) {
      throw new BadRequestError("Email ou senha inválidos.")
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_PASS!, {
      expiresIn: "1d"
    })

    const { password: _, posts, ...userLogin } = user

    res.status(200).json({ token, user: userLogin })
  }
}

export default new UserController()
