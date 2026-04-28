import bcrypt from "bcrypt";
import { Prisma } from "../../generated/prisma/client.js";
import prisma from "../../lib/prisma.js";
import { signToken } from "../../lib/jwt.js";

const SALT_ROUNDS = 12;

type SignupInput = {
  name: string;
  email: string;
  password: string;
  username: string;
};

type LoginInput = {
  username: string;
  password: string;
};

export const signup = async ({ name, email, password, username }: SignupInput) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
    select: {
      email: true,
      username: true,
    },
  });

  if (existingUser?.email === email) {
    throw new Error("Email already in use");
  }

  if (existingUser?.username === username) {
    throw new Error("Username already in use");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, username },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
      },
    });

    return {
      message: "User created successfully",
      user,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("Email or username already in use");
    }

    throw error;
  }
};

export const login = async ({ username, password }: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      password: true,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw new Error("Invalid credentials");
  }

  const token = signToken(user.id);
  const { password: _password, ...safeUser } = user;

  return {
    message: "Signin successful",
    token,
    user: safeUser,
  };
};
