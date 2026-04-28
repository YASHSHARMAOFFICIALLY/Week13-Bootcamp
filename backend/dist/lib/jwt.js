import "dotenv/config";
import jwt from "jsonwebtoken";
const getJwtSecret = () => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not set");
    }
    return jwtSecret;
};
export const signToken = (userId) => {
    return jwt.sign({ userId }, getJwtSecret(), {
        expiresIn: "7d",
    });
};
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, getJwtSecret());
    }
    catch {
        throw new Error("Invalid token");
    }
};
