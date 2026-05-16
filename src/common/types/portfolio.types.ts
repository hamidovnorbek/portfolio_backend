import { Request } from 'express';
import { Document, Types } from 'mongoose';
import { AcceptLanguages } from '../constant/languages';
import { User } from '../db/models/portfolio/user/user.model';

export interface PortfolioRequest extends Request {
    user: User & Document & { _id: Types.ObjectId };
    lang: AcceptLanguages;
    payload?: { username: string };
}
