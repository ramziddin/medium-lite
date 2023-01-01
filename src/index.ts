import dotenv from "dotenv"
import helmet from "helmet"
import express from "express"
import { apiRouter } from "./routes/api"

dotenv.config()

const { PORT } = process.env

const app = express()

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api", apiRouter)

app.listen(PORT)
