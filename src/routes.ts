import { Router } from "express"
import postController from "./controllers/postController"
import userController from "./controllers/userController"
import { auth } from "./middlewares/auth"
import "express-async-errors"
import schemaParse from "./middlewares/schemaParse"
import { validUUID, userSchema, postSchema } from "./schemas/"

const router = Router()

// POSTS
router.get("/post", postController.index)
router.get("/post/:postId", schemaParse(validUUID), postController.show)
router.post(
  "/post",
  schemaParse(validUUID),
  schemaParse(postSchema),
  auth,
  postController.store
)
router.put(
  "/post/:postId",
  schemaParse(validUUID),
  schemaParse(postSchema),
  auth,
  postController.update
)
router.delete(
  "/post/:postId",
  schemaParse(validUUID),
  auth,
  postController.delete
)

// USERS
router.get("/user", userController.index)
router.get("/user/:userId", schemaParse(validUUID), userController.show)
router.post("/user", schemaParse(userSchema), userController.store)
router.post("/user/login", userController.login)
router.put(
  "/user/:userId",
  schemaParse(validUUID),
  schemaParse(userSchema),
  auth,
  userController.update
)
router.delete(
  "/user/:userId",
  schemaParse(validUUID),
  auth,
  userController.delete
)

export default router
