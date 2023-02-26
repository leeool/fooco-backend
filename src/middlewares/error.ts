import { NextFunction, Request, Response } from "express"
import logController from "../controllers/logController"
import ApiError from "../helpers/apiErrors"
import logRepository from "../repositories/logRepository"

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

  if (statusCode === 429) {
    req.log = logRepository.create({
      message: err.message,
      statusCode: err.statusCode,
      method: req.method,
      path: req.path,
      ip: req.ip,
      logDate: new Date()
    })

    logController.store(req, res)
  }

  console.log({
    message: err.message,
    statusCode: err.statusCode,
    method: req.method,
    path: req.path
  })

  return res.status(statusCode).json({ error: message })
}

export default errorMiddleware
