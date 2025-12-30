import z from "zod";

export const signUpSchema = z
  .object({
    email: z.email({ error: "Please enter a valid email" }),
    password: z
      .string({ error: "Password cannot be empty" })
      .min(8, { error: "Password should be at least 8 characters long." })
      .max(100, {
        error: "Password cannot be greater than 100 characters long.",
      }),
    confirmPassword: z
      .string({ error: "Password cannot be empty" })
      .min(8, { error: "Password should be at least 8 characters long." })
      .max(100, {
        error: "Password cannot be greater than 100 characters long.",
      }),
    name: z
      .string({ error: "Name cannot be empty" })
      .min(2, { error: "Name should be at least 2 characters long." })
      .max(100, { error: "Name cannot be more than 100 characters long." }),
    role: z.enum(["USER", "ADMIN"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match",
  });

export const loginSchema = z.object({
  email: z.email({ error: "Please enter a valid email" }),
  password: z
    .string({ error: "Password cannot be empty" })
    .min(8, { error: "Password should be at least 8 characters long." })
    .max(100, {
      error: "Password cannot be greater than 100 characters long.",
    }),
});
