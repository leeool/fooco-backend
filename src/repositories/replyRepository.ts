import AppDataSource from "../data-source"
import Reply from "../entities/Reply"

const replyRepository = AppDataSource.getRepository(Reply)

export default replyRepository
