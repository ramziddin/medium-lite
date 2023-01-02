import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import express from "express"
import session from "express-session"
import helmet from "helmet"
import { apiRouter } from "./routes/api"

dotenv.config()

const { PORT, SESSION_SECRET } = process.env

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(helmet())
app.use(
  session({
    secret: SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
)
app.use("/api", apiRouter)

app.listen(PORT)
