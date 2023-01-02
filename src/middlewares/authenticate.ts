import { NextFunction, Request, Response } from "express"

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.user) return res.redirect("/login")
  else next()
}
