import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import express from "express"
import session from "express-session"
import helmet from "helmet"
import { apiRouter } from "./routes/api"
import { PrismaSessionStore } from "@quixo3/prisma-session-store"
import { prisma } from "./services/prisma"

dotenv.config()

const { PORT, SESSION_SECRET } = process.env

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(cookieParser())
app.use(
  session({
    resave: false,
    secret: SESSION_SECRET!,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 24 * 60 * 60 * 1_000,
    }),
  })
)
app.use("/api", apiRouter)
app.set("view engine", "ejs")

app.listen(PORT)
