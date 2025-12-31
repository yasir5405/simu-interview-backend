import { Request, Response } from "express";
import { topicSchema } from "../lib/validations/topic.validation";
import { prisma } from "../lib/prisma";

export const postTopics = async (req: Request, res: Response) => {
  const parsedBody = topicSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid data format",
      error: parsedBody.error.issues[0].message,
    });
  }

  const { name } = parsedBody.data;
  const normalizedName = name.trim().toLowerCase();

  try {
    const topic = await prisma.topic.create({
      data: {
        name: normalizedName,
      },
    });

    res.status(201).json({
      success: true,
      message: `Topic created successfully`,
      topic,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: `Topic with name: ${normalizedName} already exists`,
      });
    }
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getTopics = async (req: Request, res: Response) => {
  try {
    const topics = await prisma.topic.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    res.status(200).json({
      success: true,
      message: "Topics fetched successfully",
      topics,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
