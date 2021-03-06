import { Request, Response, NextFunction } from "express";
import { LoggedUserDto } from "../entities/auth/output/login.output.dto";
import { plainToClass } from "class-transformer";
import { isAuthLogic } from "../services/auth/auth.logic.setup";

export const isAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.isAuthenticated()) {
    next();
  } else {
    const token: string | undefined = req
      .get("Authorization")
      ?.replace("Bearer ", "");
    isAuthLogic(token)
      .then((user) => {
        const userLogged = plainToClass(LoggedUserDto, {
          ...user,
          token: token,
        });
        req.user = userLogged;
        next();
      })
      .catch((err) => next(err));
  }
};
