import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm"
import User from "./User"
import Comment from "./Comment"

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

  @OneToMany(() => Comment, (comment) => comment.post_id, {
    nullable: true,
    eager: true,
    cascade: ["remove"]
  })
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
  reply: Comment[]

  @ManyToMany(() => User, (user) => user.savedPosts, {
    onDelete: "CASCADE",
    orphanedRowAction: "delete"
  })
  usersSaved: User[]

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "user_id" })
  user: User
}

export default Post
