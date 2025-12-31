import { z } from "zod";

export const topicSchema = z.object({
  name: z
    .string({ error: "Topic name cannot be empty" })
    .min(2, { error: "Topic name should be at least 2 characters long." })
    .max(50, { error: "Topic name should be less than 50 characters long" }),
});
