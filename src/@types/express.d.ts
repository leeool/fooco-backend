import express from "express"
import { Request } from "express"
import Log from "../entities/Log"

declare global {
  namespace Express {
    interface Request {
      log?: Log
    }
  }
}
