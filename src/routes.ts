import { Router } from "express"

const router = Router()

router.get("/", (req, res) => {
  res.send("Hello World!")
})
router.get("/posts", (req, res) => {
  res.json({
    posts: [
      {
        id: 1,
        title: "Post 1",
        content: "Post 1 content"
      },
      {
        id: 2,
        title: "Post 2",
        content: "Post 2 content"
      }
    ]
  })
})

export default router
