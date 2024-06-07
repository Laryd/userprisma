import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";
import { UnprocessableEntity } from "../exceptions/validation";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    let user = await prismaClient.user.findFirst({
      where: { email },
    });

    if (!user) {
      return next(
        new BadRequestsException(
          "User does not exist",
          ErrorCode.USER_NOT_FOUND
        )
      );
    }

    if (!compareSync(password, user.password)) {
      return next(
        new BadRequestsException(
          "Incorrect password",
          ErrorCode.INCORRECT_PASSWORD
        )
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET!
    );

    res.json({ user, token });
  } catch (err:any) {
    next(new UnprocessableEntity(err?.cause?.issues, "Unprocessable entity", ErrorCode.UNPROCESSABLE_ENTITY));
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name, phone } = req.body;

    let user = await prismaClient.user.findFirst({
      where: { email },
    });

    if (user) {
      return next(
        new BadRequestsException(
          "User already exists",
          ErrorCode.USER_ALREADY_EXISTS
        )
      );
    }

    user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
        phone,
        isAdmin: false,
      },
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
};
