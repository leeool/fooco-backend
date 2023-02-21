import Express from "express"
import postRepository from "../repositories/postRepository"

class postController {
  index(req: Express.Request, res: Express.Response) {
    const posts = postRepository.findAll()

    res.json(posts)
  }
  show(req: Express.Request, res: Express.Response) {
    const { id } = req.params
    const post = postRepository.findById(id)

    if (!post) {
      return res.status(400).json({ error: "Post not found" })
    }

    res.json(post)
  }
  store(req: Express.Request, res: Express.Response) {
    const { title, content } = req.body

    if (!title || !content) {
      return res.status(400).json({ error: "Post not valid" })
    }

    const post = postRepository.create({ title, content })

    res.json(post)
  }
  update(req: Express.Request, res: Express.Response) {
    const { title, content } = req.body
    const { id } = req.params

    const postById = postRepository.findById(id)

    if (!postById) {
      return res.status(400).json({ error: "Post not found" })
    }

    if (!title || !content) {
      return res.status(400).json({ error: "Post not valid" })
    }

    const updatedPost = postRepository.update(id, { title, content })

    res.json(updatedPost)
  }
  delete(req: Express.Request, res: Express.Response) {
    const { id } = req.params

    const postById = postRepository.findById(id)

    if (!postById) {
      return res.status(400).json({ error: "Post not found" })
    }

    const deletedPost = postRepository.delete(id)

    res.json(deletedPost)
  }
}

export default new postController()
