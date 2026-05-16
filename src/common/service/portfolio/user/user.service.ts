import { Injectable } from '@nestjs/common';
import { User, UserModel } from 'src/common/db/models/portfolio/user/user.model';
import { UserError } from 'src/common/db/models/portfolio/user/user.error';
import { ErrorCodes } from 'src/common/filter/common.error';
import { CommonService } from '../../common.service';

@Injectable({})
export class UserService extends CommonService<User> {
    constructor() {
        super(UserModel, ErrorCodes.USER, ErrorCodes.USER + 1);
    }

    async getByUsername(username: string) {
        const user = await this.findOne({ username });
        if (!user) throw UserError.NotFound(username);
        return user;
    }
}

export const userService = new UserService();
