import Express from "express"
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError
} from "../helpers/apiErrors"
import postRepository from "../repositories/postRepository"
import userRepository from "../repositories/userRepository"
import jwt from "jsonwebtoken"
import { Any, ArrayOverlap, Not } from "typeorm"
import commentRepository from "../repositories/commentRepository"
import Cap from "../helpers/capitalize"
import Post from "../entities/Post"
import groupRepository from "../repositories/groupRepository"

class postController {
  async index(req: Express.Request, res: Express.Response) {
    const { created_at = "desc", q = "" } = req.query

    let posts: Post[]

    if (q) {
      console.log(Cap<Array<string>>(String(q).trim().split(" ")))
      posts = await postRepository.find({
        relations: {
          user: true,
          comments: true
        },
        where: {
          tags: ArrayOverlap(Cap<Array<string>>(String(q).trim().split(" ")))
        },
        loadEagerRelations: false,
        select: ["id", "title", "slug", "created_at", "points", "tags"],
        order: { created_at: created_at === "asc" ? "ASC" : "DESC" }
      })
    } else {
      posts = await postRepository.find({
        relations: {
          user: true,
          comments: true,
          group: true
        },
        where: { group: { id: "7e170c4f-a480-4503-aee6-e7071c9c6dd5" } },
        loadEagerRelations: false,
        select: ["id", "title", "slug", "created_at", "points", "tags"],
        order: { created_at: created_at === "asc" ? "ASC" : "DESC" }
      })
    }

    res.status(200).json(posts)
  }

  async show(req: Express.Request, res: Express.Response) {
    const { username, post_slug } = req.params

    const userExists = await userRepository.findOneBy({ username })

    const post = await postRepository.findOne({
      relations: { user: true, comments: false, group: true },
      where: { user: { username }, slug: post_slug }
    })

    if (!userExists || !post) {
      throw new NotFoundError("Página não encontrada.")
    }

    if (!post_slug) {
      const userPosts = await postRepository.find({
        relations: { user: true },
        where: { user: { username: username } }
      })

      res.json(userPosts)
      return
    }

    res.json(post)
  }

  async store(
    req: Express.Request<{}, {}, createPostTypes>,
    res: Express.Response
  ) {
    const {
      title,
      content,
      user_id,
      tags,
      group_id = "7e170c4f-a480-4503-aee6-e7071c9c6dd5"
    } = req.body
    const { authorization } = req.headers
    const removeSpecialChars = /[^A-Za-z0-9\s-]/g
    const slugTitle = title
      .normalize("NFD")
      .replaceAll(removeSpecialChars, "")
      .toLowerCase()
      .split(" ")
      .join("-")

    if (!title || !content) {
      throw new BadRequestError("Titulo e conteúdo não foram informados.")
    }
    const token = authorization!.split(" ")[1]

    if (!authorization || !token) {
      throw new UnauthorizedError("Não autorizado.")
    }

    const userExists = await userRepository.findOneBy({ id: user_id })

    if (!userExists) {
      throw new NotFoundError("Usuário não encontrado.")
    }

    const { id: token_id } = jwt.verify(token, process.env.JWT_PASS!) as {
      id: string
    }

    if (userExists.id !== token_id) {
      throw new UnauthorizedError("Usuário não autorizado.")
    }

    const userAlreadyHasPost = await postRepository.find({
      where: { slug: slugTitle, user: { id: user_id } }
    })

    if (userAlreadyHasPost.length > 0) {
      throw new ForbiddenError("Já existe um post com esse título.")
    }

    const { password, posts, ...user } = userExists

    const group = await groupRepository.findOne({ where: { id: group_id } })

    if (!group) {
      throw new NotFoundError("Grupo não encontrado.")
    }

    const post = postRepository.create({
      title,
      content,
      user,
      tags: tags ? Cap<Array<string>>(tags) : [],
      slug: slugTitle,
      users_liked: [user.id],
      points: 1,
      group
    })
    await postRepository.save(post)

    res.status(201).json(post)
  }

  async update(
    req: Express.Request<updatePostParamsTypes, {}, updatePostTypes>,
    res: Express.Response
  ) {
    const { title, content, user_id, tags } = req.body
    const { post_id } = req.params
    const { authorization } = req.headers

    let postById = await postRepository.findOne({
      relations: { user: true },
      where: { id: post_id }
    })

    const userById = await userRepository.findOne({
      where: { id: user_id },
      relations: { posts: true }
    })

    const userOwnerPost = await postRepository.find({
      where: { user: { id: user_id }, id: post_id }
    })

    if (!postById) {
      throw new NotFoundError("Post não encontrado.")
    }

    if (!userById) {
      throw new NotFoundError("Usuário não encontrado.")
    }

    const token = authorization!.split(" ")[1]

    const { id: token_id } = jwt.verify(token, process.env.JWT_PASS!) as {
      id: string
    }

    if (userById.id !== token_id) {
      throw new UnauthorizedError("Usuário não autorizado.")
    }

    if (!userOwnerPost.length) {
      throw new ForbiddenError("Este post não pertence ao usuário.")
    }

    const userAlreadyHasPost = await postRepository.find({
      where: { title: title, user: { id: user_id }, id: Not(post_id) }
    })

    if (userAlreadyHasPost.length > 0) {
      throw new ForbiddenError("Já existe um post com esse título.")
    }

    const updatedPost = postRepository.create({
      title,
      content,
      tags: tags ? Cap<Array<string>>(tags) : []
    })
    await postRepository.update(post_id, updatedPost)

    postById = await postRepository.findOne({
      relations: { user: true },
      where: { id: post_id }
    })

    res.json(postById)
  }

  async delete(req: Express.Request, res: Express.Response) {
    const { post_id } = req.params
    const { user_id } = req.body
    const { authorization } = req.headers

    const postById = await postRepository.findBy({ id: post_id })
    const userById = await userRepository.findOneBy({ id: user_id })

    const userOwnerPost = await postRepository.find({
      where: { user: { id: user_id }, id: post_id },
      relations: { user: true }
    })

    if (!userOwnerPost.length) {
      throw new ForbiddenError("Este post não pertence ao usuário.")
    }

    if (!postById) {
      throw new NotFoundError("Post não encontrado.")
    }

    if (!userById) {
      throw new NotFoundError("Usuário não encontrado.")
    }

    const token = authorization!.split(" ")[1]

    const { id: token_id } = jwt.verify(token, process.env.JWT_PASS!) as {
      id: string
    }

    if (userById.id !== token_id) {
      throw new UnauthorizedError("Usuário não autorizado.")
    }

    res.status(204).json(postById)
    await postRepository.delete(post_id)
  }

  async feedback(
    req: Express.Request<{ post_id: string }, {}, { user_id: string }>,
    res: Express.Response
  ) {
    const { post_id } = req.params
    const { user_id } = req.body
    const { type } = req.query

    const postById = await postRepository.findOneBy({ id: post_id })

    if (!postById) {
      throw new NotFoundError("Post não encontrado.")
    }

    const userExists = await userRepository.findOneBy({ id: user_id })

    if (!userExists) {
      throw new NotFoundError("Usuário não encontrado.")
    }

    if (!type || !["like", "dislike"].includes(type as string)) {
      throw new BadRequestError("Opção inválida.")
    }

    if (type === "like") {
      // usuário ja tem o post marcado com like
      if (postById.users_liked.includes(userExists.id)) {
        await postRepository.decrement({ id: post_id }, "points", 1)
        await postRepository.update(postById.id, {
          users_liked: postById.users_liked.filter(
            (value) => value !== userExists.id
          )
        })

        res.json(postById.points - 1)
      }

      // usuário tem o post marcado com dislike
      else if (postById.users_disliked.includes(userExists.id)) {
        await postRepository.increment({ id: post_id }, "points", 2)
        await postRepository.update(postById.id, {
          users_liked: [...postById.users_liked, userExists.id],
          users_disliked: postById.users_disliked.filter(
            (value) => value !== userExists.id
          )
        })

        res.json(postById.points + 2)
      }

      // usuário não tem o post marcado com dislike nem like
      else {
        await postRepository.increment({ id: post_id }, "points", 1)
        await postRepository.update(postById.id, {
          users_liked: [...postById.users_liked, userExists.id]
        })

        res.json(postById.points + 1)
      }
    } else if (type === "dislike") {
      // usuário já tem o post marcado com dislike
      if (postById.users_disliked.includes(userExists.id)) {
        await postRepository.increment({ id: post_id }, "points", 1)
        await postRepository.update(postById.id, {
          users_disliked: postById.users_disliked.filter(
            (value) => value !== userExists.id
          )
        })
        res.json(postById.points + 1)
      }

      // usuário tem o post marcado com like
      else if (postById.users_liked.includes(userExists.id)) {
        await postRepository.decrement({ id: post_id }, "points", 2)
        await postRepository.update(postById.id, {
          users_disliked: [...postById.users_disliked, userExists.id],
          users_liked: postById.users_liked.filter(
            (value) => value !== userExists.id
          )
        })
        res.json(postById.points - 2)
      }

      // usuário nao deu like nem dislike
      else {
        await postRepository.decrement({ id: post_id }, "points", 1)

        await postRepository.update(postById.id, {
          users_disliked: [...postById.users_disliked, userExists.id]
        })

        res.json(postById.points - 1)
      }
    }
  }
}

export default new postController()
