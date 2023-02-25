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

  @CreateDateColumn({
    transformer: {
      to: (date: Date) => {
        return new Date()
      },
      from: (date: Date) => {
        return date.toLocaleString("pt-BR", {
          localeMatcher: "best fit"
        })
      }
    }
  })
  created_at: Date
}

export default User
