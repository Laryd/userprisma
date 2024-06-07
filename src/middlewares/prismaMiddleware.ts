import { Prisma, PrismaClient } from "@prisma/client";
import { RegisterSchema } from "../schema/users";

// Define your Prisma middleware
export const prismaMiddleware: Prisma.Middleware = async (params, next) => {
  if (params.model === "User" && params.action === "create") {
    // Validate data for create operation using RegisterSchema
    params.args.data = RegisterSchema.parse(params.args.data);
  }
  // Call the next middleware or the Prisma engine
  return next(params);
};
