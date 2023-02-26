import { Router } from "express"
import "express-async-errors"
import postController from "./controllers/postController"
import userController from "./controllers/userController"
import tokenController from "./controllers/tokenController"
import setLimiter from "./middlewares/rateLimiter"
import auth from "./middlewares/auth"
import schemaParse from "./middlewares/schemaParse"
import {
  postSchema,
  schemaUpdateUser,
  schemaGetUser,
  schemaDeleteUser,
  schemaCreateUser
} from "./schemas/"
import {
  deleteUserLimit,
  loginUserLimit,
  postUserLimit,
  updateUserLimit
} from "./helpers/limiters"

const router = Router()

// POSTS
router.get("/post", postController.index)
router.get("/post/:postId", postController.show)
router.post("/post", schemaParse(postSchema), auth, postController.store)
router.put(
  "/post/:postId",
  schemaParse(postSchema),
  auth,
  postController.update
)
router.delete("/post/:postId", auth, postController.delete)

// USERS
router.get("/user", userController.index)
router.get("/user/:user_id", schemaParse(schemaGetUser), userController.show)
router.post(
  "/user",
  setLimiter(postUserLimit),
  schemaParse(schemaCreateUser),
  userController.store
)
router.post("/user/login", setLimiter(loginUserLimit), userController.login)
router.put(
  "/user/:user_id",
  setLimiter(updateUserLimit),
  schemaParse(schemaUpdateUser),
  auth,
  userController.update
)
router.delete(
  "/user/:user_id",
  setLimiter(deleteUserLimit),
  auth,
  schemaParse(schemaDeleteUser),
  userController.delete
)

// TOKEN
router.post("/token", tokenController.validadeToken)

export default router
