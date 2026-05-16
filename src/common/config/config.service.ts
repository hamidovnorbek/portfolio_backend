import { config, DotenvParseOutput } from 'dotenv';
import { ConfigKeysUnion, IConfigService } from './config.interface';
import * as path from 'path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService implements IConfigService {
    private config: DotenvParseOutput;

    constructor() {
        const env = `.env.${process.env.NODE_ENV || 'development'}`;
        const { error, parsed } = config({
            path: path.resolve(env),
        });
        if (error) {
            throw new Error(`${env} not found`);
        }
        if (!parsed) {
            throw new Error(`${env} is empty`);
        }
        this.config = parsed;
    }

    get(key: ConfigKeysUnion): string {
        const res = this.config[key];
        if (!res) {
            throw new Error(`${key} not found`);
        }
        return res;
    }
}
export const configService = new ConfigService();
