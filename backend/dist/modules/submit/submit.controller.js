import { ZodError } from "zod";
import { getUserFromToken } from "../../lib/auth.js";
import { submitSchema } from "../../utils/zodSchema.js";
import { submitProblem } from "./submit.service.js";
const getErrorMessage = (error) => {
    if (error instanceof ZodError) {
        return error.issues[0]?.message ?? "Invalid request body";
    }
    if (error instanceof Error) {
        return error.message;
    }
    return "Something went wrong";
};
export const submit = async (req, res) => {
    try {
        const data = submitSchema.parse(req.body);
        const userId = getUserFromToken(req);
        const result = await submitProblem({ userId, problemId: data.problemId });
        res.status(201).json({
            success: true,
            message: "Problem submitted successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: getErrorMessage(error),
        });
    }
};
