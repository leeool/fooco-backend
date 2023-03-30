import { Request, Response } from "express"
import postRepository from "../repositories/postRepository"
import userRepository from "../repositories/userRepository"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Equal, Not } from "typeorm"
import {
  BadRequestError,
  NotFoundError,
  TooManyRequests,
  UnauthorizedError
} from "../helpers/apiErrors"

class UserController {
  async index(req: Request, res: Response) {
    const users = await userRepository.find({
      relations: { posts: true }
    })
    res.status(200).json(users)
  }

  async show(req: Request, res: Response) {
    const { username } = req.params

    const user = await userRepository.findOne({
      relations: { posts: { user: true } },
      where: { username: username }
    })

    if (!user) {
      throw new BadRequestError("Usuário não encontrado.")
    }

    res.json(user)
  }

  async store(req: Request<{}, {}, createUserTypes>, res: Response) {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      throw new BadRequestError("Todos os campos são obrigatórios.")
    }

    const usernameExists = await userRepository.findOne({
      where: { username }
    })

    const emailExists = await userRepository.findOne({
      where: { email }
    })

    if (usernameExists) {
      throw new BadRequestError("Este apelido já está em uso! Tente outro.")
    }

    if (emailExists) {
      throw new BadRequestError("Este e-mail já está em uso! Tente outro.")
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

  async update(
    req: Request<updateUserParamsTypes, {}, updateUserTypes>,
    res: Response
  ) {
    const { user_id } = req.params
    const {
      username,
      email,
      password,
      about,
      avatar_url,
      banner_url,
      educational_place,
      educational_place_url,
      saved_posts
    } = req.body
    const { authorization } = req.headers

    let user = await userRepository.findOne({
      where: { id: user_id },
      select: { id: true, username: true, email: true, password: true }
    })

    if (!user) {
      throw new NotFoundError("Usuário não encontrado.")
    }

    const token = authorization!.split(" ")[1]

    const { id: token_id } = jwt.verify(token, process.env.JWT_PASS!) as {
      id: string
    }

    if (user.id !== token_id) {
      throw new UnauthorizedError("Usuário não autorizado.")
    }

    const usernameExists = await userRepository.findOne({
      where: { username: Equal(username || ""), id: Not(user_id) }
    })

    const emailExists = await userRepository.findOne({
      where: { email: Equal(email || ""), id: Not(user_id) }
    })

    if (usernameExists) {
      throw new BadRequestError("Este username já está em uso! Tente outro.")
    }

    if (emailExists) {
      throw new BadRequestError("Este e-mail já está em uso! Tente outro.")
    }

    const updatedPassword = password
      ? await bcrypt.hash(password, 10)
      : user.password

    const updatedUser = userRepository.create({
      username: username || user.username,
      email: email || user.email,
      password: updatedPassword,
      about,
      avatar_url,
      banner_url,
      educational_place,
      educational_place_url,
      saved_posts: user.saved_posts.concat(saved_posts)
    })

    await userRepository.update(user_id, updatedUser)

    user = await userRepository.findOne({
      where: { id: user_id },
      relations: { posts: true }
    })

    res.status(200).json(user)
  }

  async delete(req: Request<deleteUserParamsTypes>, res: Response) {
    const { user_id } = req.params
    const { authorization } = req.headers

    const userExists = await userRepository.findOne({
      where: { id: user_id },
      relations: { posts: true }
    })

    if (!userExists) {
      throw new NotFoundError("Usuário não encontrado.")
    }

    const token = authorization!.split(" ")[1]

    const { id: token_id } = jwt.verify(token, process.env.JWT_PASS!) as {
      id: string
    }

    if (userExists.id !== token_id) {
      throw new UnauthorizedError("Usuário não autorizado.")
    }

    await postRepository.delete({ user: { id: user_id } })
    await userRepository.delete(user_id)

    res.status(200).json(userExists)
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body

    if (!email || !password) {
      throw new BadRequestError("Todos os campos são obrigatórios.")
    }

    const user = await userRepository.findOne({
      where: [{ email: email }, { username: email }],
      select: [
        "password",
        "id",
        "username",
        "email",
        "about",
        "avatar_url",
        "banner_url",
        "educational_place",
        "educational_place_url",
        "posts",
        "created_at"
      ]
    })

    if (!user) {
      throw new BadRequestError("E-mail ou senha inválidos.")
    }

    const verifiedPassword = await bcrypt.compare(password, user.password)

    if (!verifiedPassword) {
      throw new BadRequestError("E-mail ou senha inválidos.")
    }

    const token = jwt.sign(
      { username: user.username, id: user.id },
      process.env.JWT_PASS!,
      {
        expiresIn: "1d"
      }
    )

    const { password: _, ...userLogin } = user

    res.status(200).json({ token, user: userLogin })
  }
}

export default new UserController()
