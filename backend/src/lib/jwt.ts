import "dotenv/config";
import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not set");
  }

  return jwtSecret;
};

export const signToken = (userId: number) => {
  return jwt.sign({ userId }, getJwtSecret(), {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, getJwtSecret()) as { userId: number };
  } catch {
    throw new Error("Invalid token");
  }
};
