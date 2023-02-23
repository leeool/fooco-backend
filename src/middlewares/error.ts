import { NextFunction, Request, Response } from "express"
import ApiError from "../helpers/apiErrors"

const errorMiddleware = (
  err: Error & Partial<ApiError>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = err.statusCode
    ? err.message
    : "Foquinho encontrou um problema."
  const statusCode = err.statusCode || 500
  console.log(err.message)
  return res.status(statusCode).json({ error: message })
}

export default errorMiddleware
