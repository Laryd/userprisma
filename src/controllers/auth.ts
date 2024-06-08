import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";
import { RegisterSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found";



export const register = async (
  req: Request,
  res: Response,
) => {
  RegisterSchema.parse(req.body);
  const { email, password, name, phone } = req.body;

  let user = await prismaClient.user.findFirst({
    where: { email },}) 
  if (user) {
    throw new BadRequestsException(
      "User already exists",
      ErrorCode.USER_ALREADY_EXISTS
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
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({
    where: { email },
  });

  if (!user) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }

  if (!compareSync(password, user.password)) {
    throw new BadRequestsException(
      "Incorrect password",
      ErrorCode.INCORRECT_PASSWORD
    );
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET!
  );

  res.json({ user, token });
};

// /me => return logged in user
export const me = async (
  req: Request,
  res: Response,
) => {
  res.json(req.user);
  
};

// Retrieve all users
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  const users = await prismaClient.user.findMany();
  res.json(users);
};

// Create a new user
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name, phone, isAdmin } = req.body;

  let user = await prismaClient.user.findFirst({
    where: { email },
  });

  if (user) {
    throw new BadRequestsException(
      "User already exists",
      ErrorCode.USER_ALREADY_EXISTS
    );
  }

  user = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashSync(password, 10),
      phone,
      isAdmin: !!isAdmin,
    },
  });

  res.json(user);
}

// Retrieve a specific user by ID
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const user = await prismaClient.user.findUnique({
    where: { id: Number(id) },
  });

  if (!user) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }

  res.json(user);
};

// Update an existing user
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { email, password, name, phone, isAdmin } = req.body;

  let user = await prismaClient.user.findUnique({
    where: { id: Number(id) },
  });

  if (!user) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }

  user = await prismaClient.user.update({
    where: { id: Number(id) },
    data: {
      name,
      email,
      password: password ? hashSync(password, 10) : user.password,
      phone,
      isAdmin: isAdmin !== undefined ? !!isAdmin : user.isAdmin,
    },
  });

  res.json(user);
};

// Delete a user from the database
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const user = await prismaClient.user.findUnique({
    where: { id: Number(id) },
  });

  if (!user) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }

  await prismaClient.user.delete({
    where: { id: Number(id) },
  });

  res.json({ message: "User deleted successfully" });
};