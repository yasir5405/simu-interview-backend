import { z } from "zod";

export const attemptSchema = z.object({
  questionId: z.number({ error: "Question ID is required" }).int().positive(),
  answer: z.unknown(),
  timeTaken: z
    .number({ error: "Time taken must be a number" })
    .int()
    .nonnegative()
    .optional(),
});
