import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm"
import User from "./User"
import Post from "./Post"

@Entity("replies")
class Reply {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => Post, (post) => post.id)
  @Column({ type: "uuid" })
  post_id: string

  @Column({ type: "text" })
  content: string

  @Column({ type: "int", default: 0 })
  points: number

  @Column({
    default: () => "LOCALTIMESTAMP"
  })
  created_at: Date

  @Column({ default: [], array: true, type: "varchar" })
  users_liked: string[]

  @Column({ default: [], array: true, type: "varchar" })
  users_disliked: string[]

  @OneToMany(() => Reply, (reply) => reply.id)
  replies: Reply[]

  @ManyToOne(() => User, (user) => user.reply)
  @JoinTable({
    name: "reply_user",
    joinColumn: {
      name: "reply_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "user_id",
      referencedColumnName: "id"
    }
  })
  user: User
}

export default Reply
