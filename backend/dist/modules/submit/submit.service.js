import { SubmissionStatus } from "../../generated/prisma/client.js";
import prisma from "../../lib/prisma.js";
export const submitProblem = async ({ userId, problemId }) => {
    const problem = await prisma.problem.findUnique({
        where: { id: problemId },
        select: {
            id: true,
            courseId: true,
        },
    });
    if (!problem) {
        throw new Error("Problem does not exist");
    }
    return prisma.$transaction(async (tx) => {
        const submission = await tx.submission.create({
            data: {
                userId,
                problemId,
                status: SubmissionStatus.accepted,
            },
            select: {
                id: true,
                problemId: true,
                status: true,
                submittedAt: true,
            },
        });
        const totalProblems = await tx.problem.count({
            where: {
                courseId: problem.courseId,
            },
        });
        const solvedProblems = await tx.submission.findMany({
            where: {
                userId,
                status: SubmissionStatus.accepted,
                problem: {
                    courseId: problem.courseId,
                },
            },
            distinct: ["problemId"],
            select: {
                problemId: true,
            },
        });
        const completionPercentage = totalProblems === 0
            ? 0
            : Number(((solvedProblems.length / totalProblems) * 100).toFixed(2));
        const progress = await tx.progress.upsert({
            where: {
                userId_courseId: {
                    userId,
                    courseId: problem.courseId,
                },
            },
            create: {
                userId,
                courseId: problem.courseId,
                completionPercentage,
                completedAt: completionPercentage === 100 ? new Date() : null,
            },
            update: {
                completionPercentage,
                completedAt: completionPercentage === 100 ? new Date() : null,
            },
            select: {
                courseId: true,
                completionPercentage: true,
                completedAt: true,
            },
        });
        return {
            submission,
            progress,
        };
    });
};
