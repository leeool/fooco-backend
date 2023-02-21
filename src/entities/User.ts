import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm"
import Post from "./Post"

@Entity("users")
class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "varchar", length: 100, unique: true })
  username: string

  @Column({ type: "varchar", length: 100, unique: true })
  email: string

  @Column({ type: "varchar", length: 100 })
  password: string

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[]

  @CreateDateColumn()
  created_at: Date
}

export default User
