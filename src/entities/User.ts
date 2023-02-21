import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import Post from "./Post"

@Entity("users")
class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar", length: 100, unique: true })
  username: string

  @Column({ type: "varchar", length: 100, unique: true })
  email: string

  @Column({ type: "varchar", length: 100 })
  password: string

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[]

  @Column({ type: "date", update: false })
  created_at: Date
}

export default User
