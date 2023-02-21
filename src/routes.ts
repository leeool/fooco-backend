import { Router } from "express"
import postController from "./controllers/postController"
import userController from "./controllers/userController"

const router = Router()

// POSTS
router.get("/post", postController.index)
router.get("/post/:id", postController.show)
router.post("/post", postController.store)
router.delete("/post/:id", postController.delete)
router.put("/post/:id", postController.update)

// USERS
router.post("/user", userController.store)
router.get("/user", userController.index)
router.get("/user/:id", userController.show)
router.put("/user/:id", userController.update)
router.delete("/user/:id", userController.delete)

export default router
