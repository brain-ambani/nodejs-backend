//  CREATE A USER

import { db } from "@/db/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export async function createUser(req: Request, res: Response) {
  const {
    email,
    username,
    password,
    firstName,
    lastNAme,
    phone,
    dob,
    gender,
    image,
    role,
  } = req.body;

  try {
    // check for fields validation
    if (!email || !username || !password || !firstName || !lastNAme || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // check if user already exists by email, phone or username
    const existingUserByEmail = await db.user.findUnique({
      where: {
        email,
      },
    });
    const existingUserByUsername = await db.user.findUnique({
      where: {
        username,
      },
    });
    const existingUserByPhone = await db.user.findUnique({
      where: {
        phone,
      },
    });

    if (existingUserByEmail) {
      res.status(409).json({
        error: `Email ${email} already exists`,
      });
      return;
    }
    if (existingUserByUsername) {
      res.status(409).json({
        error: `Username ${username} already taken`,
      });
      return;
    }
    if (existingUserByPhone) {
      res.status(409).json({
        error: `Phone number ${phone} already exists`,
      });
      return;
    }

    // hash password
    const hashedPassword: string = await bcrypt.hash(password, 10);

    // create user
    const newUser = await db.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastNAme,
        phone,
        dob,
        gender,
        image: image
          ? image
          : "https://icons8.com/icon/tZuAOUGm9AuS/user-default",
      },
    });

    // Modify the return user not to include the password
    const { password: userPassword, ...user } = newUser;

    res.status(201).json({
      data: user,
      error: null,
    });
  } catch (error) {
    console.log(error);
  }
}
