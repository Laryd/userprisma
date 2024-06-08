import { Router } from "express";
import { createUser, deleteUser, getUserById, getUsers, login, me, register, updateUser } from "../controllers/auth";
import { errorHandler } from "../error-handler";
import authMiddleware, { isAdmin } from "../middlewares/auth";


const authRoutes:Router = Router()

authRoutes.post('/login', errorHandler(login))
authRoutes.post('/login', errorHandler(login))

authRoutes.post("/register", errorHandler(register))

authRoutes.get("/me", [authMiddleware], errorHandler(me));

// User routes
authRoutes.get("/users", [authMiddleware], errorHandler(getUsers));
authRoutes.post("/users", [authMiddleware, isAdmin], errorHandler(createUser));
authRoutes.get("/users/:id", [authMiddleware], errorHandler(getUserById));
authRoutes.put("/users/:id", [authMiddleware], errorHandler(updateUser));
authRoutes.delete("/users/:id", [authMiddleware], errorHandler(deleteUser));

export default authRoutes