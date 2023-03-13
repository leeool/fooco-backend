import Express from "express"
import ApiError, {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError
} from "../helpers/apiErrors"
import postRepository from "../repositories/postRepository"
import userRepository from "../repositories/userRepository"
import jwt from "jsonwebtoken"

class postController {
  async index(req: Express.Request, res: Express.Response) {
    const posts = await postRepository.find({
      relations: {
        user: true
      }
    })

    res.status(200).json(posts)
  }

  async show(req: Express.Request, res: Express.Response) {
    const { post_id } = req.params

    const post = await postRepository.findOne({
      relations: { user: true },
      where: { id: post_id }
    })

    if (!post) {
      throw new NotFoundError("Post nao encontrado.")
    }

    res.json(post)
  }

  async store(
    req: Express.Request<{}, {}, createPostTypes>,
    res: Express.Response
  ) {
    const { title, content, user_id, tags } = req.body
    const { authorization } = req.headers

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

    if (!title || !content) {
      throw new BadRequestError("Titulo e conteúdo não foram informados.")
    }

    const { password, posts, ...user } = userExists

    const post = postRepository.create({ title, content, user, tags })
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

    const updatedPost = postRepository.create({ title, content, tags })
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
    req: Express.Request<
      { post_id: string },
      {},
      { option: "like" | "dislike"; user_id: string }
    >,
    res: Express.Response
  ) {
    const { post_id } = req.params
    const { user_id, option } = req.body

    const postById = await postRepository.findOneBy({ id: post_id })

    if (!postById) {
      throw new NotFoundError("Post não encontrado.")
    }

    const userExists = await userRepository.findOneBy({ id: user_id })

    if (!userExists) {
      throw new NotFoundError("Usuário não encontrado.")
    }

    if (!option || !["like", "dislike"].includes(option)) {
      throw new BadRequestError("Opção inválida.")
    }

    if (option === "like") {
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
    } else if (option === "dislike") {
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
