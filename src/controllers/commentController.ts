import Express from "express"
import commentRepository from "../repositories/commentRepository"
import { BadRequestError, NotFoundError } from "../helpers/apiErrors"
import userRepository from "../repositories/userRepository"
import postRepository from "../repositories/postRepository"

class commentController {
  index() {
    return "Hello World"
  }

  async show(req: Express.Request, res: Express.Response) {
    const { reply_id } = req.params

    const reply = await commentRepository.findOne({
      where: { id: reply_id },
      // relationLoadStrategy: "query",
      relations: { user: true, replies: true }
    })

    if (!reply) {
      throw new NotFoundError("Resposta não encontrada.")
    }

    res.status(200).json(reply)
  }

  async store(
    req: Express.Request<createReplyParamsTypes, {}, createReplyTypes>,
    res: Express.Response
  ) {
    const { post_id } = req.params
    const { content, user_id } = req.body

    const post = await postRepository.findOneBy({ id: post_id })

    if (!post) {
      throw new NotFoundError("Publicação não encontrada.")
    }

    const user = await userRepository.findOneBy({ id: user_id })

    if (!user) {
      throw new NotFoundError("Usuário não encontrado.")
    }

    const comment = commentRepository.create({ content, user, post_id })

    await commentRepository.save(comment)

    res.status(201).json({ ...comment, replies: [] })
  }

  async getByPost(req: Express.Request, res: Express.Response) {
    const { post_id } = req.params

    const post = await postRepository.findOneBy({ id: post_id })

    if (!post) {
      throw new NotFoundError("Publicação não encontrada.")
    }

    const comments = await commentRepository.find({
      where: { post_id },
      relationLoadStrategy: "query",
      relations: {
        user: true,
        replies: { user: true }
      },
      order: { created_at: "DESC", replies: { created_at: "DESC" } }
    })

    res.status(200).json(comments)
  }

  update() {}

  delete() {}

  async addReply(req: Express.Request, res: Express.Response) {
    const { parent_id, post_id } = req.params
    const { content, user_id } = req.body

    const parent = await commentRepository.findOne({
      where: { id: parent_id },
      relations: { replies: true }
    })

    const post = await postRepository.findOneBy({ id: post_id })

    if (!parent || !post) {
      throw new NotFoundError("Publicação não encontrada.")
    }

    const user = await userRepository.findOneBy({ id: user_id })

    if (!user) {
      throw new NotFoundError("Usuário não encontrado.")
    }

    const reply = commentRepository.create({
      content,
      user,
      parent: parent
    })

    const replies =
      parent.replies?.length > 0 ? [...parent.replies, reply] : [reply]

    const data = await commentRepository.preload({
      id: parent_id,
      replies
    })

    if (!data) return

    const newReply = await commentRepository.save(reply)

    res.status(201).json({ ...newReply, replies: [] })
  }

  async feedback(req: Express.Request, res: Express.Response) {
    const { target_id } = req.params
    const { type } = req.query
    const { user_id } = req.body

    const target = await commentRepository.findOne({
      where: { id: target_id },
      relations: { replies: true }
    })

    if (!target) {
      throw new NotFoundError("Resposta não encontrada.")
    }

    const user = await userRepository.findOneBy({ id: user_id })

    if (!user) {
      throw new NotFoundError("Usuário não encontrado.")
    }

    if (type === "like") {
      // usuário ja tem o post marcado com like
      if (target.users_liked.includes(user.id)) {
        await commentRepository.decrement({ id: target_id }, "points", 1)
        await commentRepository.update(target.id, {
          users_liked: target.users_liked.filter((value) => value !== user.id)
        })

        res.json(target.points - 1)
      }

      // usuário tem o post marcado com dislike
      else if (target.users_disliked.includes(user.id)) {
        await commentRepository.increment({ id: target_id }, "points", 2)
        await commentRepository.update(target.id, {
          users_liked: [...target.users_liked, user.id],
          users_disliked: target.users_disliked.filter(
            (value) => value !== user.id
          )
        })

        res.json(target.points + 2)
      }

      // usuário não tem o post marcado com dislike nem like
      else {
        await commentRepository.increment({ id: target_id }, "points", 1)
        await commentRepository.update(target.id, {
          users_liked: [...target.users_liked, user.id]
        })

        res.json(target.points + 1)
      }
    } else if (type === "dislike") {
      // usuário já tem o post marcado com dislike
      if (target.users_disliked.includes(user.id)) {
        await commentRepository.increment({ id: target_id }, "points", 1)
        await commentRepository.update(target.id, {
          users_disliked: target.users_disliked.filter(
            (value) => value !== user.id
          )
        })
        res.json(target.points + 1)
      }

      // usuário tem o post marcado com like
      else if (target.users_liked.includes(user.id)) {
        await commentRepository.decrement({ id: target_id }, "points", 2)
        await commentRepository.update(target.id, {
          users_disliked: [...target.users_disliked, user.id],
          users_liked: target.users_liked.filter((value) => value !== user.id)
        })
        res.json(target.points - 2)
      }

      // usuário nao deu like nem dislike
      else {
        await commentRepository.decrement({ id: target_id }, "points", 1)

        await commentRepository.update(target.id, {
          users_disliked: [...target.users_disliked, user.id]
        })

        res.json(target.points - 1)
      }
    } else {
      throw new BadRequestError("Tipo de feedback inválido.")
    }
  }
}

export default new commentController()
