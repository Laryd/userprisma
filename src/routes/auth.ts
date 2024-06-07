import { Router } from "express";
import { login, register } from "../controllers/auth";
import { errorHandler } from "../error-handler";


const authRoutes:Router = Router()

authRoutes.post('/login', errorHandler(login))

authRoutes.post("/register", errorHandler(register))
export default authRoutes