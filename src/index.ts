import dotenv from "dotenv"
import helmet from "helmet"
import express from "express"

dotenv.config()

const { PORT } = process.env

const app = express()

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded())

app.listen(PORT)
