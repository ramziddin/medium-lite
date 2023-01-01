import bcrypt from "bcrypt"

export const hash = (data: string) => bcrypt.hash(data, 10)

export const compareHash = (data: string, hash: string) =>
  bcrypt.compare(data, hash)
