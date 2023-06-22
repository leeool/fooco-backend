import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import Post from "./Post"

@Entity("groups")
class Group {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "varchar" })
  name: string

  @Column({ type: "text" })
  description: string

  @OneToMany(() => Post, (post) => post.group, { eager: true })
  posts: Post[]
}

export default Group
