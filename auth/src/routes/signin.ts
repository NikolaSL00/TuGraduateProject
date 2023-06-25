import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { Password } from "../services/password";
import { User } from "../models/user";
import { validateRequest, BadRequestError } from "@shopsmart/common";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Имейлът трябва да е валиден"),
    body("password").trim().notEmpty().withMessage("Трябва да въведете парола"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Невалиден имейл или парола");
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError("Невалиден имейл или парола");
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    // // Store it on session object
    // req.session = {
    //   jwt: userJwt,
    // };

    const reqSess = req.session;
    res.status(200).send({
      token: userJwt,
      userEmail: existingUser.email,
      userLocationCity: existingUser.locationCity,
    });
  }
);

export { router as signinRouter };
