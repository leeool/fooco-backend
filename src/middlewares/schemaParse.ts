import { NextFunction, Request, Response } from "express"
import { AnyZodObject, ZodError, ZodIssue } from "zod"
import { BadRequestError } from "../helpers/apiErrors"

const schemaParse =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    const body = req.body
    const params = req.params
    try {
      schema.parse({ body, params })
      next()
    } catch (err) {
      if (err instanceof ZodError<ZodIssue[]>) {
        const error = err.errors.map((e) => e.message)[0]
        console.log(err.errors)
        throw new BadRequestError(error)
      }
    }
  }

export default schemaParse
