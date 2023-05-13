import Express from "express"
import postRepository from "../repositories/postRepository"
import { NotFoundError } from "../helpers/apiErrors"
import replyRepository from "../repositories/replyRepository"
import userRepository from "../repositories/userRepository"

class replyController {
  index() {
    return "Hello World"
  }

  async show(req: Express.Request, res: Express.Response) {
    const { reply_id } = req.params

    const reply = await replyRepository.findOne({
      where: { id: reply_id },
      relations: ["user"]
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

    const reply = replyRepository.create({ content, user, post_id })

    await replyRepository.save(reply)

    res.status(201).json(reply)
  }

  update() {}

  delete() {}
}

export default new replyController()
