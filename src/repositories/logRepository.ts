import AppDataSource from "../data-source"
import Log from "../entities/Log"

const logRepository = AppDataSource.getRepository(Log)

export default logRepository
