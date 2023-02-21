import { Router } from "express"
import postController from "./controllers/postController"
import userController from "./controllers/userController"

const router = Router()

// POSTS
router.get("/posts", postController.index)
router.get("/posts/:id", postController.show)
router.post("/posts", postController.store)
router.delete("/posts/:id", postController.delete)
router.put("/posts/:id", postController.update)

// USERS
router.post("/user", userController.create)

export default router
