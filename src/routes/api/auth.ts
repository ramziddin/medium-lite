import { Router } from "express"
import { prisma } from "../../services/prisma"
import { User as PrismaUser } from "@prisma/client"
import { StatusCodes } from "http-status-codes"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime"
import { PrismaError } from "prisma-error-enum"
import { validate as validateEmail } from "email-validator"
import bcrypt from "bcrypt"

declare module "express-session" {
  interface SessionData {
    user: PrismaUser
  }
}

export const hash = (data: string) => bcrypt.hash(data, 10)

export const compareHash = (data: string, hash: string) =>
  bcrypt.compare(data, hash)

export const authRouter = Router()

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body

  if (typeof email !== "string") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Missing email",
    })
  }

  if (!validateEmail(email)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Invalid email format",
    })
  }

  if (typeof password !== "string") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Missing password",
    })
  }

  if (password.length < 4) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Password should be longer than 3 characters",
    })
  }

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

  if (typeof name !== "string") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Missing name",
    })
  }

  if (typeof email !== "string") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Missing email",
    })
  }

  if (!validateEmail(email)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Invalid email format",
    })
  }

  if (typeof password !== "string") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Missing password",
    })
  }

  if (password.length < 4) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Password should be longer than 3 characters",
    })
  }

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
        res
          .status(StatusCodes.CONFLICT)
          .json({ error: "Email is already in use" })
      }
    }
  }
})

authRouter.get("/logout", async (req, res) => {
  req.session.destroy(() => res.end())
})
