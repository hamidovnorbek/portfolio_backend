import { Request } from 'express';
import { Document, Types } from 'mongoose';
import { AcceptLanguages } from '../constant/languages';
import { Employee } from '../db/models/employee/employee.model';

export interface CustomRequest extends Request {
    user: Employee & Document;
    lang: AcceptLanguages;
    organization_id?: Types.ObjectId;
}
