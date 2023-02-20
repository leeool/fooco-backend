import { Router } from "express"
import postController from "./controllers/postController"

const router = Router()

router.get("/posts", postController.index)
router.get("/posts/:id", postController.show)
router.post("/posts", postController.store)
router.delete("/posts/:id", postController.delete)
router.put("/posts/:id", postController.update)

export default router
