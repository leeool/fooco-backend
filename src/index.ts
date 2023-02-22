import Express from "express"
import cors from "cors"
import router from "./routes"
import AppDataSource from "./data-source"
import errorMiddleware from "./middlewares/error"

AppDataSource.initialize().then(() => {
  const app = Express()

  app.use(Express.json())
  app.use(cors())
  app.use(router)

  app.use(errorMiddleware)

  app.listen(process.env.PORT, () => {
    console.log("🔥 Server is running at http://localhost:" + process.env.PORT)
  })
})
