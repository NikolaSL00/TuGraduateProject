import { User } from '../models/user';
import { validateRequest, BadRequestError } from '@shopsmart/common';

import express, { Request, Response } from 'express';
import { body } from 'express-validator';

const router = express.Router();



router.put('/api/users/changeLocationCity', async (req: Request, res: Response) => {

    const { email, locationCity } = req.body;


    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new BadRequestError('Невалиден имейл');
    }

    existingUser.locationCity = locationCity;
    await existingUser.save();

    res.status(200).send({ message: 'Успешно променена локация', existingUser });
});

export { router as changeLoctionCityRouter };
