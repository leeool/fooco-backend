import Express from "express"
import postRepository from "../repositories/postRepository"
import { NotFoundError } from "../helpers/apiErrors"
import commentRepository from "../repositories/commentRepository"
import userRepository from "../repositories/userRepository"

class commentController {
  index() {
    return "Hello World"
  }

  async show(req: Express.Request, res: Express.Response) {
    const { reply_id } = req.params

    const reply = await commentRepository.findOne({
      where: { id: reply_id },
      // relationLoadStrategy: "query",
      relations: ["user", "replies"]
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

    const reply = commentRepository.create({ content, user, post_id })

    await commentRepository.save(reply)

    res.status(201).json(reply)
  }

  update() {}

  delete() {}

  async addReply(req: Express.Request, res: Express.Response) {
    const { parent_id, post_id } = req.params
    const { content, user_id } = req.body

    const parent = await commentRepository.findOne({
      where: { id: parent_id },
      relations: ["replies"]
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

    console.log(replies)

    const data = await commentRepository.preload({
      id: parent_id,
      replies
    })

    if (!data) return

    await commentRepository.save(data)

    res.status(201).json(reply)
  }
}

export default new commentController()
