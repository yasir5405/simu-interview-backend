import { Request, Response } from "express";
import { attemptSchema } from "../lib/validations/attempt.validation";
import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";

export const postAttempt = async (req: Request, res: Response) => {
  const parsedBody = attemptSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid attempt payload",
      error: parsedBody.error.issues[0].message,
    });
  }

  const { answer, questionId, timeTaken } = parsedBody.data;

  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    let isCorrect = false;

    if (question.type === "MCQ") {
      if (
        typeof answer !== "number" ||
        !Number.isInteger(answer) ||
        !Array.isArray(question.options) ||
        answer < 0 ||
        answer >= question.options.length
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid answer for MCQ question",
        });
      }
      const correctAnswer = question.correctAnswer as { index: number };
      isCorrect = answer === correctAnswer.index;
    }

    if (question.type === "TEXT") {
      if (typeof answer !== "string" || answer.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid answer for TEXT question",
        });
      }

      const normalizedAnswer = answer.toLowerCase();
      const correctAnswer = question.correctAnswer as { keywords: string[] };

      isCorrect = correctAnswer.keywords.some((kw) =>
        normalizedAnswer.includes(kw.toLowerCase())
      );
    }

    const score = isCorrect ? 1 : 0;

    await prisma.attempt.create({
      data: {
        userId: user.id,
        questionId,
        userAnswer: answer as Prisma.InputJsonValue,
        isCorrect,
        score,
        timeTaken,
      },
    });

    // 6️⃣ Response (minimal feedback)
    return res.status(201).json({
      success: true,
      message: "Attempt recorded",
      isCorrect,
      score,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAttempts = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    const attempts = await prisma.attempt.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        attemptedAt: "desc",
      },
      select: {
        id: true,
        questionId: true,
        isCorrect: true,
        score: true,
        timeTaken: true,
        attemptedAt: true,
        question: {
          select: {
            questionText: true,
            type: true,
            difficulty: true,
            topicId: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Attempts fetched successfully",
      attempts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
