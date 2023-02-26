import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from "typeorm"

@Entity("logs")
class Log {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({
    transformer: {
      from: (date: Date) => {
        return date.toLocaleString("pt-BR", {
          localeMatcher: "best fit"
        })
      },
      to: (date: Date) => {
        return new Date(date)
      }
    }
  })
  logDate: Date

  @Column({ type: "varchar" })
  ip: string

  @Column({ type: "varchar" })
  method: string

  @Column({ type: "varchar" })
  path: string

  @Column({ type: "text" })
  message: string

  @Column({ type: "int" })
  statusCode: number
}

export default Log
