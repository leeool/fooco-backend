import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
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

  @Column({ type: "text" })
  password: string

  @OneToMany(() => Post, (post) => post.user, { eager: true })
  @JoinTable({
    name: "post_user",
    joinColumn: {
      name: "user_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "post_id",
      referencedColumnName: "id"
    }
  })
  posts: Post[]

  @CreateDateColumn()
  created_at: Date
}

export default User
