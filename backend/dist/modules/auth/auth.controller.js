import { ZodError } from "zod";
import { signinSchema, signupSchema } from "../../utils/zodSchema.js";
import { login, signup } from "./auth.service.js";
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};
const getErrorMessage = (error) => {
    if (error instanceof ZodError) {
        return error.issues[0]?.message ?? "Invalid request body";
    }
    if (error instanceof Error) {
        return error.message;
    }
    return "Something went wrong";
};
export const signin = async (req, res) => {
    try {
        const data = signinSchema.parse(req.body);
        const result = await login(data);
        res.cookie("token", result.token, COOKIE_OPTIONS);
        res.status(200).json({
            success: true,
            message: result.message,
            token: result.token,
            user: result.user,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: getErrorMessage(error),
        });
    }
};
export const register = async (req, res) => {
    try {
        const data = signupSchema.parse(req.body);
        const result = await signup(data);
        res.status(201).json({
            success: true,
            message: result.message,
            user: result.user,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: getErrorMessage(error),
        });
    }
};
