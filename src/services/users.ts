import { User } from "@prisma/client"
import { prisma } from "./prisma"

type GetUserDTO = Omit<User, "password">
type CreateUserDTO = Omit<User, "id">

const defaultUserSelect = {
  id: true,
  name: true,
  email: true,
}

export const getUniqueUser = async (id: number): Promise<GetUserDTO | null> => {
  return prisma.user.findUnique({
    where: { id },
    select: defaultUserSelect,
  })
}

export const getUniqueUserByEmail = async (
  email: string
): Promise<GetUserDTO | null> => {
  return prisma.user.findUnique({
    where: { email },
    select: defaultUserSelect,
  })
}

export const createUser = async (dto: CreateUserDTO) => {
  return prisma.user.create({
    data: dto,
    select: defaultUserSelect,
  })
}

export const getManyUsers = (): Promise<GetUserDTO[]> => {
  return prisma.user.findMany({
    select: defaultUserSelect,
  })
}
