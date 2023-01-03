import { Router } from "express"
import { StatusCodes } from "http-status-codes"
import { getManyUsers, getUniqueUser } from "../../services/users"

export const usersRouter = Router()

usersRouter.get("/", async (req, res) => {
  const users = await getManyUsers()
  res.status(StatusCodes.OK).json(users)
})

usersRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id)

  if (typeof id !== "number" || isNaN(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Expected numeric id" })
  }

  const user = await getUniqueUser(id)

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" })
  }

  res.status(StatusCodes.OK).json(user)
})
