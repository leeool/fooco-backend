import AppDataSource from "../data-source"
import Post from "../entities/Post"

const postRepository = AppDataSource.getRepository(Post)

export default postRepository
