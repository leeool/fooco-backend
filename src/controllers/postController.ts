import Express from "express"
import postRepository from "../repositories/postRepository"
import userRepository from "../repositories/userRepository"

class postController {
  async index(req: Express.Request, res: Express.Response) {
    const posts = await postRepository.find({
      relations: {
        user: true
      }
    })

    res.status(200).json(posts)
  }

  async show(req: Express.Request, res: Express.Response) {
    const { id } = req.params
    const post = await postRepository.findOne({
      relations: { user: true },
      where: { id: id }
    })

    if (!post) {
      return res.status(400).json({ error: "Post not found" })
    }

    res.json(post)
  }

  async store(req: Express.Request, res: Express.Response) {
    const { title, content, user_id } = req.body

    if (!title || !content) {
      return res.status(400).json({ error: "Post not valid" })
    }

    const userExists = await userRepository.findOneBy({ id: user_id })

    if (!userExists) {
      return res.status(400).json({ error: "User not found" })
    }

    const post = postRepository.create({ title, content, user: userExists })
    await postRepository.save(post)

    console.log(post)

    res.status(201).json(post)
  }

  async update(req: Express.Request, res: Express.Response) {
    const { title, content, user_id } = req.body
    const { id } = req.params

    const postById = await postRepository.findOne({
      relations: { user: true },
      where: { id: id }
    })

    const userById = await userRepository.findOne({
      where: { id: user_id },
      relations: { posts: true }
    })

    const userOwnerPost = await postRepository.find({
      where: { user: { id: user_id }, id: id },
      relations: { user: true }
    })

    if (!postById) {
      return res.status(404).json({ error: "Post not found" })
    }

    if (!userById) {
      return res.status(404).json({ error: "User not found" })
    }

    if (!title || !content) {
      return res.status(400).json({ error: "Post not valid" })
    }

    if (!userOwnerPost.length) {
      return res.status(403).json({ error: "This user not own this post" })
    }

    const updatedPost = postRepository.create({ ...postById, title, content })
    await postRepository.update(id, updatedPost)

    res.json(updatedPost)
  }

  async delete(req: Express.Request, res: Express.Response) {
    const { id } = req.params
    const { user_id } = req.body

    const postById = postRepository.findBy({ id: id })

    const userOwnerPost = await postRepository.find({
      where: { user: { id: user_id }, id: id },
      relations: { user: true }
    })

    if (!userOwnerPost.length) {
      return res.status(403).json({ error: "This user not own this post" })
    }

    if (!postById) {
      return res.status(404).json({ error: "Post not found" })
    }

    res.status(204).json(postById)
    await postRepository.delete(id)
  }
}

export default new postController()
