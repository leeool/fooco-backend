import { Router } from "express"
import postController from "./controllers/postController"
import userController from "./controllers/userController"
import { auth } from "./middlewares/auth"

const router = Router()

// POSTS
router.get("/post", postController.index)
router.get("/post/:postId", postController.show)
router.post("/post", auth, postController.store)
router.delete("/post/:postId", auth, postController.delete)
router.put("/post/:postId", auth, postController.update)

// USERS
router.post("/user", userController.store)
router.get("/user", userController.index)
router.get("/user/:userId", userController.show)
router.put("/user/:userId", auth, userController.update)
router.delete("/user/:userId", auth, userController.delete)
router.post("/user/login", userController.login)

export default router
