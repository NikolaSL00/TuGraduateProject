import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { BadRequestError, validateRequest } from '@shopsmart/common';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Имейлът трябва да е валиден'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Паролата трябва да е между 4 и 20 символа'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Вече съществува потребител с такъв имейл');
    }

    const user = User.build({ email, password });

    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send({ token: userJwt, userEmail: user.email, userLocationCity: user.locationCity });
  }
);

export { router as signupRouter };
