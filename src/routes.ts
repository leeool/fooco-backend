import { Router } from "express"
import "express-async-errors"
import postController from "./controllers/postController"
import userController from "./controllers/userController"
import tokenController from "./controllers/tokenController"
import auth from "./middlewares/auth"
import schemaParse from "./middlewares/schemaParse"
import {
  postSchema,
  schemaUpdateUser,
  schemaGetUser,
  schemaDeleteUser,
  schemaCreateUser,
  schemaCreatePost
} from "./schemas/"

const router = Router()

// POSTS
router.get("/post", postController.index)
router.get("/post/:username/:post_slug", postController.show)
router.get("/post/:username", postController.show)
router.post("/post", schemaParse(schemaCreatePost), auth, postController.store)
router.put(
  "/post/:post_id",
  schemaParse(postSchema),
  auth,
  postController.update
)
router.delete("/post/:post_id", auth, postController.delete)
router.post("/post/feedback/:post_id", auth, postController.feedback)

// USERS
router.get("/user", userController.index)
router.get("/user/:user_id", schemaParse(schemaGetUser), userController.show)
router.post("/user", schemaParse(schemaCreateUser), userController.store)
router.post("/user/login", userController.login)
router.put(
  "/user/:user_id",
  schemaParse(schemaUpdateUser),
  auth,
  userController.update
)
router.delete(
  "/user/:user_id",
  auth,
  schemaParse(schemaDeleteUser),
  userController.delete
)

// TOKEN
router.post("/token", tokenController.validadeToken)

export default router
