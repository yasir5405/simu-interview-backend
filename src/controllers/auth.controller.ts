import { loginSchema, signUpSchema } from "../lib/validations/auth.validation";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const signupUser = async (req: Request, res: Response) => {
  const parsedBody = signUpSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid data format",
      error: parsedBody.error.issues[0].message,
    });
  }

  const { email, name, password, role } = parsedBody.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: hashedPassword,
        role: role,
      },
    });

    const { password: _, ...safeUser } = user;

    res.status(201).json({
      success: true,
      message: "Signup successful",
      user: safeUser,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const parsedBody = loginSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid data format",
      error: parsedBody.error.issues[0].message,
    });
  }

  const { email, password } = parsedBody.data;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    const token = jwt.sign(
      {
        id: user.id,
      },
      JWT_SECRET!,
      { expiresIn: "15m" }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token: token,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const fetchUser = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "User details fetched successfully",
    user: req.user,
  });
};
