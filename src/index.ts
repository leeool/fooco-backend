import Express from "express"
import cors from "cors"
import router from "./routes"

const app = Express()

app.use(cors())
app.use(router)

app.listen(3001, () => {
  console.log("🔥 Server is running at http://localhost:3001/")
})
