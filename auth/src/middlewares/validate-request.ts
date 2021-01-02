import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //  pull validations errors from request object
  const errors = validationResult(req);

  //send error response to user
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  next();
};
