import { Request, Response } from "express"
import logRepository from "../repositories/logRepository"

class logController {
  async index(req: Request, res: Response) {
    const logs = await logRepository.find()

    res.json(logs)
  }

  async store(req: Request, res: Response) {
    const log = req.log

    if (!log) return null

    await logRepository.save(log)
  }
}

export default new logController()
