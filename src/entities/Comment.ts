import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm"
import User from "./User"
import Post from "./Post"

@Entity("comments")
class Comment {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => Post, (post) => post.id, {
    onDelete: "CASCADE",
    orphanedRowAction: "delete"
  })
  @Column({ type: "uuid", nullable: true })
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

  @ManyToOne(() => User, (user) => user.reply, {
    onDelete: "CASCADE",
    orphanedRowAction: "delete"
  })
  @JoinTable({
    name: "comment_user",
    joinColumn: {
      name: "comment_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "user_id",
      referencedColumnName: "id"
    }
  })
  user: User

  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true })
  @JoinColumn({ name: "parent_id" })
  parent: Comment

  @OneToMany(() => Comment, (comment) => comment.parent, {
    cascade: true
  })
  replies: Comment[]
}

export default Comment
