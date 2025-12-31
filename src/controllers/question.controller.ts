import { Request, Response } from "express";
import { questionSchema } from "../lib/validations/question.validation";
import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";

export const postQuestion = async (req: Request, res: Response) => {
  const parsedBody = questionSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid data format",
      error: parsedBody.error.issues[0].message,
    });
  }

  const data = parsedBody.data;

  const user = req.user!;

  try {
    const topicExists = await prisma.topic.findUnique({
      where: {
        id: data.topicId,
      },
    });

    if (!topicExists) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    const question = await prisma.question.create({
      data: {
        questionText: data.questionText,
        difficulty: data.difficulty,
        type: data.type,
        options: data.type === "MCQ" ? data.options : Prisma.JsonNull,
        correctAnswer: data.correctAnswer,
        topicId: data.topicId,
        createdBy: user.id,
      },
    });

    const { correctAnswer: _, ...safeQuestion } = question;

    return res.status(201).json({
      success: true,
      message: "Question created successfully",
      question: safeQuestion,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getQuestions = async (req: Request, res: Response) => {
  const { topicId, difficulty, type } = req.query;

  try {
    const where: any = {};

    if (topicId) where.topicId = Number(topicId);
    if (difficulty) where.difficulty = difficulty;
    if (type) where.type = type;

    const questions = await prisma.question.findMany({
      where,
      select: {
        id: true,
        questionText: true,
        difficulty: true,
        type: true,
        options: true,
        topicId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.status(200).json({
      success: true,
      message: "Questions fetched successfully",
      questions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getQuestion = async (req: Request, res: Response) => {
  const { id } = req.params;

  const questionId = Number(id);

  if (isNaN(questionId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid questiond id",
    });
  }

  try {
    const question = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
      select: {
        id: true,
        questionText: true,
        difficulty: true,
        type: true,
        options: true,
        topicId: true,
        createdAt: true,
      },
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Question fetched successfully",
      question,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
