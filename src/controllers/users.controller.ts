//  CREATE A USER

import { db } from "@/db/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export async function createUser(req: Request, res: Response): Promise<void> {
  const {
    email,
    username,
    password,
    firstName,
    lastName,
    phone,
    dob,
    gender,
    image,
    role,
  } = req.body;

  try {
    // check for fields validation
    if (!email || !username || !password || !firstName || !lastName || !phone) {
      res.status(400).json({ message: "All fields are required" });
      return;
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
        lastName,
        phone,
        dob,
        role,
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
    res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
    return;
  }
}

export async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const usersWithoutPassword = users.map((user) => {
      const { password, ...users } = user;
      return users;
    });

    res.status(200).json({
      data: usersWithoutPassword,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something not wrong",
      data: null,
    });
    return;
  }
}

export async function getUserById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    // Check if the user exists before destructuring
    if (!user) {
      res.status(404).json({
        error: "User not found",
        data: null,
      });
      return;
    }

    const { password, ...uniqueUser } = user;

    res.status(200).json({
      data: uniqueUser,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
    return;
  }
}

export async function updateUserById(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  const {
    email,
    username,
    firstName,
    lastName,
    phone,
    dob,
    gender,
    image,
    password,
  } = req.body;
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    // Check if the user exists before destructuring
    if (!user) {
      res.status(404).json({
        error: "User not found",
        data: null,
      });
      return;
    }

    // check if the email, phone, username are unique

    if (email && email !== user.email) {
      const existingUserByEmail = await db.user.findUnique({
        where: {
          email,
        },
      });
      if (existingUserByEmail) {
        res.status(409).json({
          error: `Email ${email} already exists`,
        });
        return;
      }
    }

    if (username && username !== user.username) {
      const existingUserByUsername = await db.user.findUnique({
        where: {
          username,
        },
      });
      if (existingUserByUsername) {
        res.status(409).json({
          error: `Username ${username} already taken`,
        });
        return;
      }
    }

    if (phone && phone !== user.phone) {
      const existingUserByPhone = await db.user.findUnique({
        where: {
          phone,
        },
      });
      if (existingUserByPhone) {
        res.status(409).json({
          error: `Phone number ${phone} already exists`,
        });
        return;
      }
    }

    // hash password
    let hashedPassword = user.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data: {
        email,
        username,
        firstName,
        lastName,
        phone,
        dob,
        gender,
        image,
        password: hashedPassword,
      },
    });

    // Modify the return user not to include the password
    const { password: userPassword, ...others } = updatedUser;

    res.status(200).json({
      data: others,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
    return;
  }
}

export async function updateUserPasswordById(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  const { password } = req.body;
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    // Check if the user exists before destructuring
    if (!user) {
      res.status(404).json({
        error: "User not found",
        data: null,
      });
      return;
    }

    // hash password
    const hashedPassword: string = await bcrypt.hash(password, 10);

    const updatedPassword = await db.user.update({
      where: {
        id,
      },
      data: {
        password: hashedPassword,
      },
    });

    // Modify the return user not to include the password
    const { password: savedPassword, ...others } = updatedPassword;

    res.status(200).json({
      message: "Password updated successfully",
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
    return;
  }
}

export async function deleteUserById(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    // Check if the user exists before destructuring
    if (!user) {
      res.status(404).json({
        error: "User not found",
        data: null,
      });
      return;
    }

    await db.user.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      sucesss: "User deleted successfully",
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
    return;
  }
}

export async function getAttendants(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        role: "ATTENDANT",
      },
    });

    const usersWithoutPassword = users.map((user) => {
      const { password, ...users } = user;
      return users;
    });

    res.status(200).json({
      data: usersWithoutPassword,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something not wrong",
      data: null,
    });
    return;
  }
}
