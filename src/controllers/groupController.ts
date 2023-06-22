import { Request, Response } from "express"
import groupRepository from "../repositories/groupRepository"

class GroupController {
  async index(req: Request, res: Response) {
    const groups = await groupRepository.find()

    res.status(200).json(groups)
  }

  async show(req: Request, res: Response) {
    const { id } = req.params

    const group = await groupRepository.findOne({
      where: { id: id },
      relationLoadStrategy: "query",
      relations: { posts: { user: true, group: true } },
      order: { posts: { created_at: "DESC" } }
    })

    res.status(200).json(group)
  }

  async store(req: Request, res: Response) {
    const { name, description } = req.body

    const group = groupRepository.create({ name, description })

    await groupRepository.save(group)

    res.status(201).json(group)
  }
}

export default new GroupController()
