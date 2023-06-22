import AppDataSource from "../data-source"
import Group from "../entities/Group"

const groupRepository = AppDataSource.getRepository(Group)

export default groupRepository
