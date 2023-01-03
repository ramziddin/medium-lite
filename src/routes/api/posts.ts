import { Router } from "express"
import { StatusCodes } from "http-status-codes"
import { authenticate } from "../../middlewares/authenticate"
import { createPost, getManyPosts, getUniquePost } from "../../services/posts"
import { prisma } from "../../services/prisma"

export const postsRouter = Router()

postsRouter.get("/", async (req, res) => {
  const authorId =
    typeof req.query.authorId === "string"
      ? Number(req.query.authorId)
      : undefined

  const posts = await getManyPosts({ where: { authorId } })

  res.status(StatusCodes.OK).json(posts)
})

postsRouter.post("/", authenticate, async (req, res) => {
  const { title, content, published } = req.body

  if (typeof title !== "string") {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "Missing title" })
  }

  if (typeof content !== "string") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Missing content" })
  }

  if (typeof published !== "boolean") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Missing published" })
  }

  const post = await createPost({
    title,
    content,
    authorId: req.session.user!.id,
  })

  res.status(StatusCodes.CREATED).json(post)
})

postsRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id)

  if (typeof id !== "number" || isNaN(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Expected numeric id" })
  }

  const post = await getUniquePost(id)

  if (!post) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "Post doesn't exist" })
  }

  res.status(StatusCodes.OK).json(post)
})

postsRouter.delete("/:id", authenticate, async (req, res) => {
  const id = Number(req.params.id)

  if (typeof id !== "number" || isNaN(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Expected numeric id" })
  }

  await prisma.post.delete({ where: { id } })

  res.status(StatusCodes.OK).end()
})
