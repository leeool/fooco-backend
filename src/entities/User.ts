import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm"
import Post from "./Post"
import Comment from "./Comment"

@Entity("users")
class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "varchar", unique: true })
  username: string

  @Column({ type: "varchar", default: "" })
  slug: string

  @Column({ type: "varchar", unique: true })
  email: string

  @Column({ type: "text", select: false })
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

  @OneToMany(() => Comment, (comment) => comment.user)
  @JoinTable({
    name: "user_comment",
    joinColumn: {
      name: "user_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "comment_id",
      referencedColumnName: "id"
    }
  })
  reply: Comment[]

  @Column({ type: "varchar", default: "" })
  educational_place: string

  @Column({ type: "varchar", default: "" })
  educational_place_url: string

  @Column({ type: "varchar", length: 500, default: "" })
  about: string

  @Column({ type: "varchar", default: "" })
  avatar_url: string

  @Column({ type: "varchar", default: "" })
  banner_url: string

  @ManyToMany(() => Post, (post) => post.usersSaved, { cascade: true })
  @JoinTable()
  savedPosts: Post[]

  @CreateDateColumn({
    transformer: {
      from: (date: Date) => {
        return date.toLocaleString("pt-BR", {
          localeMatcher: "best fit"
        })
      },
      to: (date: Date) => {
        return new Date()
      }
    }
  })
  created_at: Date
}

export default User
