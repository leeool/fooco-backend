import { Request } from "express"
import { rateLimit } from "express-rate-limit"
import { TooManyRequests } from "../helpers/apiErrors"

interface Props {
  timeInMinutes: number
  maxRequests: number
  message: string
}

const setLimiter = ({ timeInMinutes, maxRequests, message }: Props) => {
  const rateLimiter = rateLimit({
    windowMs: timeInMinutes * 60000,
    max: maxRequests,
    keyGenerator: (req: Request) => {
      return req.ip
    },
    handler: (req: Request, _) => {
      throw new TooManyRequests(`${message} (${req.ip})`)
    },
    legacyHeaders: true
  })

  return rateLimiter
}

export default setLimiter
