import { Router } from "express"
import "express-async-errors"
import postController from "./controllers/postController"
import userController from "./controllers/userController"
import tokenController from "./controllers/tokenController"
import auth from "./middlewares/auth"
import schemaParse from "./middlewares/schemaParse"
import {
  schemaUpdateUser,
  schemaGetUser,
  schemaDeleteUser,
  schemaCreateUser,
  schemaCreatePost
} from "./schemas/"
import schemaUpdatePost from "./schemas/postSchemas/schemaUpdatePost"
import commentController from "./controllers/commentController"
import groupController from "./controllers/groupController"

const router = Router()

// POSTS
router.get("/post", postController.index)
router.get("/post/:username/:post_slug", postController.show)
router.get("/post/:username", postController.show)
router.post("/post", schemaParse(schemaCreatePost), auth, postController.store)
router.put(
  "/post/:post_id",
  schemaParse(schemaUpdatePost),
  auth,
  postController.update
)
router.delete("/post/:post_id", auth, postController.delete)
router.put("/post/feedback/:post_id", auth, postController.feedback)

// POST CHILDREN

router.get("/reply", commentController.index)
// router.get("/reply/:reply_id", commentController.show)
router.get("/reply/:post_id", commentController.getByPost)
router.post("/reply/:post_id", auth, commentController.store)
router.post("/reply/:post_id/:parent_id", auth, commentController.addReply)
router.put("/reply/feedback/:target_id", commentController.feedback)

// USERS
router.get("/user", userController.index)
router.get("/user/:username", schemaParse(schemaGetUser), userController.show)
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

// GROUP

router.get("/group", groupController.index)
router.get("/group/:id", groupController.show)
router.post("/group", groupController.store)

export default router
