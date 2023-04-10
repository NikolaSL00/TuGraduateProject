import {ValidationError} from 'express-validator';
import { CustomError } from './custom-error';
export class DatabaseConnectionError extends CustomError{
    statusCode=500;
    reason='Error connecting to db'
    constructor(){
        super("error db")

        Object.setPrototypeOf(this,DatabaseConnectionError.prototype);
    }

    serializeErrors(){
        return [{message:this.reason}]
    }
}