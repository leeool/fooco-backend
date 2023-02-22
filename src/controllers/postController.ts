import Express from "express"
import postRepository from "../repositories/postRepository"
import userRepository from "../repositories/userRepository"

class postController {
  async index(req: Express.Request, res: Express.Response) {
    const posts = await postRepository.find({
      relations: {
        user: true
      },
      select: {
        id: true,
        title: true,
        content: true,
        points: true,
        created_at: true,
        user: {
          id: true,
          username: true
        }
      }
    })

    res.status(200).json(posts)
  }

  async show(req: Express.Request, res: Express.Response) {
    const { postId } = req.params
    const post = await postRepository.findOne({
      relations: { user: true },
      where: { id: postId },
      select: { user: { id: true, username: true, posts: true } }
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

    const { password, ...user } = userExists

    const post = postRepository.create({ title, content, user })
    await postRepository.save(post)

    res.status(201).json(post)
  }

  async update(req: Express.Request, res: Express.Response) {
    const { title, content, user_id } = req.body
    const { postId } = req.params

    const postById = await postRepository.findOne({
      relations: { user: true },
      where: { id: postId }
    })

    const userById = await userRepository.findOne({
      where: { id: user_id },
      relations: { posts: true }
    })

    const userOwnerPost = await postRepository.find({
      where: { user: { id: user_id }, id: postId }
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
    await postRepository.update(postId, updatedPost)

    res.json(updatedPost)
  }

  async delete(req: Express.Request, res: Express.Response) {
    const { postId } = req.params
    const { user_id } = req.body

    const postById = postRepository.findBy({ id: postId })

    const userOwnerPost = await postRepository.find({
      where: { user: { id: user_id }, id: postId },
      relations: { user: true }
    })

    if (!userOwnerPost.length) {
      return res.status(403).json({ error: "This user not own this post" })
    }

    if (!postById) {
      return res.status(404).json({ error: "Post not found" })
    }

    res.status(204).json(postById)
    await postRepository.delete(postId)
  }
}

export default new postController()
