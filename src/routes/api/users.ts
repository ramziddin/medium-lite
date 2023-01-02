import { Router } from "express"
import { prisma } from "../../services/prisma"

export const usersRouter = Router()

usersRouter.get("/", async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
  })

  res.json(users)
})

usersRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id)

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true },
  })

  res.json(user)
})

usersRouter.get("/:id/posts", async (req, res) => {
  const authorId = Number(req.params.id)

  const posts = await prisma.post.findMany({
    where: { authorId },
  })

  res.json(posts)
})
