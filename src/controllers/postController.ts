import Express from "express"
import ApiError, {
  BadRequestError,
  ForbiddenError,
  NotFoundError
} from "../helpers/apiErrors"
import postRepository from "../repositories/postRepository"
import userRepository from "../repositories/userRepository"

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
    const { postId } = req.params

    const post = await postRepository.findOne({
      relations: { user: true },
      where: { id: postId }
    })

    if (!post) {
      throw new NotFoundError("Post nao encontrado.")
    }

    res.json(post)
  }

  async store(req: Express.Request, res: Express.Response) {
    const { title, content, user_id } = req.body

    if (!title || !content) {
      throw new BadRequestError("Titulo e conteúdo não foram informados.")
    }

    const userExists = await userRepository.findOneBy({ id: user_id })

    if (!userExists) {
      throw new NotFoundError("Usuário não encontrado.")
    }

    const { password, ...user } = userExists

    const post = postRepository.create({ title, content, user })
    await postRepository.save(post)

    res.status(201).json(post)
  }

  async update(req: Express.Request, res: Express.Response) {
    const { title, content, user_id } = req.body
    const { postId } = req.params

    let postById = await postRepository.findOne({
      relations: { user: true },
      where: { id: postId }
    })

    const userById = await userRepository.findOne({
      where: { id: user_id },
      relations: { posts: true }
    })

    const userOwnerPost = await postRepository.find({
      where: { user: { id: user_id }, id: postId }
    })

    if (!postById) {
      throw new NotFoundError("Post não encontrado.")
    }

    if (!userById) {
      throw new NotFoundError("Usuário não encontrado.")
    }

    if (!userOwnerPost.length) {
      throw new ForbiddenError("Este post não pertence ao usuário.")
    }

    const updatedPost = postRepository.create({ title, content })
    await postRepository.update(postId, updatedPost)

    postById = await postRepository.findOne({
      relations: { user: true },
      where: { id: postId }
    })

    res.json(postById)
  }

  async delete(req: Express.Request, res: Express.Response) {
    const { postId } = req.params
    const { user_id } = req.body

    const postById = postRepository.findBy({ id: postId })

    const userOwnerPost = await postRepository.find({
      where: { user: { id: user_id }, id: postId },
      relations: { user: true }
    })

    if (!userOwnerPost.length) {
      throw new ForbiddenError("Este post não pertence ao usuário.")
    }

    if (!postById) {
      throw new NotFoundError("Post não encontrado.")
    }

    res.status(204).json(postById)
    await postRepository.delete(postId)
  }
}

export default new postController()
