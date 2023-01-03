import { Post } from "@prisma/client"
import readingTime from "reading-time"
import { prisma } from "./prisma"

type PostWithDynamicFields = Post & {
  readingTime: number
}

const withDynamicFields = (
  post: Post | null | undefined
): PostWithDynamicFields | null => {
  if (!post) return null

  return {
    ...post,
    readingTime: readingTime(post.content).minutes,
  }
}

const defaultPostSelect = {
  id: true,
  title: true,
  content: true,
  published: true,
  authorId: true,
}

export const getUniquePost = async (
  id: number
): Promise<PostWithDynamicFields | null> => {
  const post = await prisma.post.findUnique({
    where: { id },
    select: defaultPostSelect,
  })

  return withDynamicFields(post)
}

export const createPost = async ({
  title,
  content,
  authorId,
}: {
  title: string
  content: string
  authorId: number
}) => {
  const post = await prisma.post.create({
    data: { title, content, authorId },
    select: defaultPostSelect,
  })

  return withDynamicFields(post)
}

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

type GetManyPostsOptions = DeepPartial<{
  where: { authorId: number }
}>

export const getManyPosts = async ({ where }: GetManyPostsOptions = {}) => {
  const posts = await prisma.post.findMany({
    where,
    select: defaultPostSelect,
  })

  return posts.map(withDynamicFields)
}
