import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getStats = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    const attempts = await prisma.attempt.findMany({
      where: { userId: user.id },
      include: {
        question: {
          include: {
            topic: true,
          },
        },
      },
    });

    const totalAttempts = attempts.length;

    let correctAttempts = 0;

    attempts.forEach((attempt) => {
      if (attempt.isCorrect) {
        correctAttempts++;
      }
    });

    const topicMap: Record<
      number,
      {
        topicId: number;
        topicName: string;
        totalAttempts: number;
        correctAttempts: number;
      }
    > = {};

    attempts.forEach((attempt) => {
      const topic = attempt.question.topic;

      if (!topicMap[topic.id]) {
        topicMap[topic.id] = {
          topicId: topic.id,
          correctAttempts: 0,
          totalAttempts: 0,
          topicName: topic.name,
        };
      }

      topicMap[topic.id].totalAttempts += 1;

      if (attempt.isCorrect) {
        topicMap[topic.id].correctAttempts += 1;
      }
    });

    const byTopic = Object.values(topicMap).map((t) => ({
      ...t,
      accuracy:
        t.totalAttempts === 0
          ? 0
          : Math.round((t.correctAttempts / t.totalAttempts) * 100),
    }));

    const timelineMap: Record<
      string,
      {
        date: string;
        totalAttempts: number;
        correctAttempts: number;
      }
    > = {};

    attempts.forEach((attempt) => {
      const dateKey = attempt.attemptedAt.toISOString().split("T")[0];

      if (!timelineMap[dateKey]) {
        timelineMap[dateKey] = {
          date: dateKey,
          totalAttempts: 0,
          correctAttempts: 0,
        };
      }

      timelineMap[dateKey].totalAttempts += 1;

      if (attempt.isCorrect) {
        timelineMap[dateKey].correctAttempts += 1;
      }
    });

    const timeline = Object.values(timelineMap).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    res.status(200).json({
      success: true,
      message: "Stats fetched successfully",
      data: {
        overall: {
          totalAttempts,
          correctAttempts,
          accuracy:
            totalAttempts === 0
              ? 0
              : Math.round((correctAttempts / totalAttempts) * 100),
        },
        byTopic,
        timeline,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
