import express, { Response, Request } from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError } from "@dafaltickets/common";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

//routers

app.all("*", async (req: Request, res: Response) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
