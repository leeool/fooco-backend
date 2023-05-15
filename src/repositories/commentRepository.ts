import AppDataSource from "../data-source"
import Comment from "../entities/Comment"

const commentRepository = AppDataSource.getRepository(Comment)

export default commentRepository
