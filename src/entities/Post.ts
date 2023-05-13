import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm"
import User from "./User"
import Reply from "./Reply"

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

  @Column({ type: "varchar", default: "" })
  slug: string

  @OneToMany(() => Reply, (reply) => reply.post_id, { eager: true })
  @JoinTable({
    name: "reply_post",
    joinColumn: {
      name: "reply_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "post_id",
      referencedColumnName: "id"
    }
  })
  children: Reply[]

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "user_id" })
  user: User
}

export default Post
