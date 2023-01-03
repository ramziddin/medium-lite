import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" })
  }

  next()
}
