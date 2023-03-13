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
    : "Foquinho encontrou um problema );"
  const statusCode = err.statusCode || 500

  console.log({
    message: err.message,
    statusCode: err.statusCode,
    method: req.method,
    path: req.path
  })

  return res.status(statusCode).json({ error: message })
}

export default errorMiddleware
