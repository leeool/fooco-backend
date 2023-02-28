import { Request } from "express"
import { rateLimit } from "express-rate-limit"
import { TooManyRequests } from "../helpers/apiErrors"
import { networkInterfaces } from "os"

interface Props {
  timeInMinutes: number
  maxRequests: number
  message: string
}

const setLimiter = ({ timeInMinutes, maxRequests, message }: Props) => {
  const rateLimiter = rateLimit({
    windowMs: timeInMinutes * 60000,
    max: maxRequests,
    keyGenerator: () => {
      const ip = networkInterfaces().eno1?.[0].address

      return ip || ""
    },
    handler: (req: Request, _) => {
      const ip = networkInterfaces().eno1?.[0].address

      throw new TooManyRequests(`${message} (${ip})`)
    },
    legacyHeaders: true
  })

  return rateLimiter
}

export default setLimiter
