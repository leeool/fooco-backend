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

  @Column({ type: "varchar", unique: true })
  username: string

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

  @Column({ type: "varchar", default: "" })
  educational_place: string

  @Column({ type: "varchar", default: "" })
  educational_place_url: string

  @Column({ type: "varchar", length: 100, default: "" })
  about: string

  @Column({ type: "varchar", default: "" })
  avatar_url: string

  @Column({ type: "varchar", default: "" })
  banner_url: string

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
