import prisma from "../../lib/prisma.js";

type ProgressInput = {
  userId: number;
};

export const getUserProgress = async ({ userId }: ProgressInput) => {
  const progressRows = await prisma.progress.findMany({
    where: {
      userId,
    },
    select: {
      userId: true,
      courseId: true,
      completionPercentage: true,
      completedAt: true,
      course: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return progressRows.map((row) => ({
    userId: row.userId,
    courseId: row.courseId,
    course: row.course.title,
    completionPercentage: row.completionPercentage.toString(),
    completedAt: row.completedAt,
  }));
};
