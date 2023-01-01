import dotenv from "dotenv"
import helmet from "helmet"
import express from "express"

dotenv.config()

const { PORT } = process.env

const app = express()

app.use(helmet())

app.get("/", async (req, res) => {
  res.end("Hello, world")
})
app.listen(PORT)
