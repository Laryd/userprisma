import express, { Express, Request, Response } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/errors";
import { RegisterSchema } from "./schema/users";

const app: Express = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("It works");
});

app.use("/api", rootRouter);


export const prismaClient = new PrismaClient({
  log: ["query"],
})
app.use(errorMiddleware);

export default app;


app.listen(PORT, () => console.log("Server running on port", PORT));
