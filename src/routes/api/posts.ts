import { Router } from "express"
import { prisma } from "../../services/prisma"

export const postsRouter = Router()

postsRouter.get("/", async (req, res) => {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      published: true,
      author: true,
    },
  })

  res.json(posts)
})

postsRouter.post("/", async (req, res) => {
  const { title, content } = req.body
})

postsRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id)

  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      authorId: true,
    },
  })

  res.json(post)
})

postsRouter.put("/:id", async (req, res) => {})

postsRouter.delete("/:id", async (req, res) => {})
