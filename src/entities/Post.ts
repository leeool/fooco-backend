import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm"
import User from "./User"

@Entity("posts")
class Post {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "varchar" })
  title: string

  @Column({ type: "text" })
  content: string

  @Column({ type: "int", default: 0 })
  points: number

  @Column({
    default: () => "LOCALTIMESTAMP"
  })
  created_at: Date

  @Column({ default: [], array: true, type: "varchar" })
  tags: string[]

  @Column({ default: [], array: true, type: "varchar" })
  users_liked: string[]

  @Column({ default: [], array: true, type: "varchar" })
  users_disliked: string[]

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "user_id" })
  user: User
}

export default Post
