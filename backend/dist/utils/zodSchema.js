import { z } from "zod";
export const signupSchema = z.object({
    username: z.string().trim().min(4, "Username must be at least 4 characters"),
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().toLowerCase().email("Invalid email"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/[a-z]/, "Password must contain a lowercase letter")
        .regex(/[0-9]/, "Password must contain a number"),
});
export const signinSchema = z.object({
    username: z.string().trim().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});
export const submitSchema = z.object({
    problemId: z.int().positive()
});
