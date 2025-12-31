import { z } from "zod";

const QuestionTypeEnum = z.enum(["MCQ", "TEXT"]);
const DifficultyEnum = z.enum(["EASY", "MEDIUM", "HARD"]);

const baseQuestionSchema = {
  questionText: z
    .string({ error: "Question Text cannot be empty" })
    .min(10, { error: "Question Text must be at least 10 characters long" })
    .max(1000, {
      error: "Question Text cannot be more than 1000 characters long",
    }),
  topicId: z.number().int().positive(),
  difficulty: DifficultyEnum,
  type: QuestionTypeEnum,
};

const mcqSchema = z
  .object({
    ...baseQuestionSchema,
    type: z.literal("MCQ"),

    options: z
      .array(z.string().min(1))
      .min(2, "MCQ must have at least 2 options"),

    correctAnswer: z.object({
      index: z.number().int().nonnegative(),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.correctAnswer.index >= data.options.length) {
      ctx.addIssue({
        path: ["correctAnswer", "index"],
        message: "Correct answer index is out of range",
        code: z.ZodIssueCode.custom,
      });
    }
  });

const textQuestionSchema = z.object({
  ...baseQuestionSchema,

  type: z.literal("TEXT"),
  options: z.undefined(),

  correctAnswer: z.object({
    keywords: z
      .array(z.string().min(2))
      .min(1, "At least one keyword is required"),
  }),
});

export const questionSchema = z.discriminatedUnion("type", [
  mcqSchema,
  textQuestionSchema,
]);
