import { Router } from "express"
import { authRouter } from "./auth"
import { postsRouter } from "./posts"
import { usersRouter } from "./users"

export const apiRouter = Router()

apiRouter.use("/auth", authRouter)
apiRouter.use("/users", usersRouter)
apiRouter.use("/posts", postsRouter)
