import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const courses = [
  {
    title: "JavaScript Foundations",
    description:
      "Practice core JavaScript syntax, control flow, arrays, and functions.",
    thumbnail: "https://placehold.co/640x360?text=JavaScript+Foundations",
    problems: [
      {
        title: "Reverse a String",
        description:
          "Write a function that returns the input string with its characters in reverse order.",
      },
      {
        title: "Sum an Array",
        description:
          "Write a function that returns the sum of all numbers in an array.",
      },
      {
        title: "Find the Largest Number",
        description:
          "Write a function that returns the largest number from a non-empty array.",
      },
    ],
  },
  {
    title: "Data Structures Basics",
    description:
      "Build confidence with common arrays, maps, sets, stacks, and queues problems.",
    thumbnail: "https://placehold.co/640x360?text=Data+Structures",
    problems: [
      {
        title: "Valid Parentheses",
        description:
          "Given a string containing brackets, determine whether every opening bracket is closed in the correct order.",
      },
      {
        title: "Two Sum",
        description:
          "Given an array of numbers and a target, return the indices of two numbers that add up to the target.",
      },
      {
        title: "Remove Duplicates",
        description:
          "Write a function that removes duplicate values from an array while preserving the first occurrence order.",
      },
    ],
  },
];

async function seed() {
  for (const courseSeed of courses) {
    const existingCourse = await prisma.course.findFirst({
      where: { title: courseSeed.title },
    });

    const course = existingCourse
      ? await prisma.course.update({
          where: { id: existingCourse.id },
          data: {
            description: courseSeed.description,
            thumbnail: courseSeed.thumbnail,
          },
        })
      : await prisma.course.create({
          data: {
            title: courseSeed.title,
            description: courseSeed.description,
            thumbnail: courseSeed.thumbnail,
          },
        });

    for (const problemSeed of courseSeed.problems) {
      const existingProblem = await prisma.problem.findFirst({
        where: {
          courseId: course.id,
          title: problemSeed.title,
        },
      });

      if (existingProblem) {
        await prisma.problem.update({
          where: { id: existingProblem.id },
          data: { description: problemSeed.description },
        });
        continue;
      }

      await prisma.problem.create({
        data: {
          courseId: course.id,
          title: problemSeed.title,
          description: problemSeed.description,
        },
      });
    }
  }
}

seed()
  .then(async () => {
    const [courseCount, problemCount] = await Promise.all([
      prisma.course.count(),
      prisma.problem.count(),
    ]);

    console.log(`Seeded database: ${courseCount} courses, ${problemCount} problems.`);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
