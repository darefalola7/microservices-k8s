import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

//check if user has a jwt
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //  if no jwt
  if (!req.session?.jwt) {
    return next();
  }

  try {
    req.currentUser = <UserPayload>(
      jwt.verify(req.session.jwt, process.env.JWT_KEY!)
    );
  } catch (e) {
    console.log(e);
  }
  next();
};
