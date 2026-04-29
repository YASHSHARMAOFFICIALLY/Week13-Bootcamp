import type { Request, Response } from "express";
import { getUserFromToken } from "../../lib/auth.js";
import { getUserProgress } from "./progress.service.js";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};

export const progress = async (req: Request, res: Response) => {
  try {
    const userId = getUserFromToken(req);
    const result = await getUserProgress({ userId });

    res.status(200).json({
      success: true,
      message: "Progress fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};
