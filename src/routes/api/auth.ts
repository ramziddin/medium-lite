import { Router } from "express"
import { compareHash, hash } from "../../services/auth"
import { prisma } from "../../services/prisma"
import { User as PrismaUser } from "@prisma/client"
import { StatusCodes } from "http-status-codes"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime"
import { PrismaError } from "prisma-error-enum"

declare module "express-session" {
  interface SessionData {
    user: PrismaUser
  }
}

export const authRouter = Router()

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).end("User doesn't exist")
  }

  if (!(await compareHash(password, user.password))) {
    return res.status(StatusCodes.FORBIDDEN).end("Passwords don't match")
  }

  req.session.user = user

  res.status(StatusCodes.OK).end()
})

authRouter.post("/signup", async (req, res) => {
  const { name, email, password } = req.body

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await hash(password),
      },
    })

    req.session.user = user

    res.end()
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === PrismaError.UniqueConstraintViolation) {
        res.status(StatusCodes.CONFLICT).end()
      }
    }
  }
})

authRouter.get("/logout", async (req, res) => {
  req.session.user = undefined
  res.end()
})
