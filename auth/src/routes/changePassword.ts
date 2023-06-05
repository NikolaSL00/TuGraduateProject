import { User } from '../models/user';
import { validateRequest, BadRequestError } from '@shopsmart/common';
import { Password } from '../services/password';

import express, { Request, Response } from 'express';
import { body } from 'express-validator';

const router = express.Router();



router.put('/api/users/changePassword', [
    body('newPassword')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters'),
], validateRequest, async (req: Request, res: Response) => {

    const { email, oldPassword, newPassword } = req.body;


    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new BadRequestError('Невалиден имейл');
    }
    const passwordsMatch = await Password.compare(
        existingUser.password,
        oldPassword
    );
    if (!passwordsMatch) {
        throw new BadRequestError('Невалидна парола');
    }

    existingUser.password = newPassword;
    await existingUser.save();

    res.status(200).send({ message: 'Успешно променена парола' });
});

export { router as changePasswordRouter };
