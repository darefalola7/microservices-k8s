import express, { Response, Request } from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { createCharge } from "./routes/new";
import { errorHandler, NotFoundError, currentUser } from "@dafaltickets/common";

const app = express();
app.set("trust proxy", true);
app.use(
  cookieSession({
    signed: false,
    // secure: process.env.NODE_ENV !== "test",
    secure: false,
  })
);
app.use(express.json());

//middlewares
app.use(currentUser);

//routers
app.use(createCharge);

app.all("*", async (req: Request, res: Response) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
