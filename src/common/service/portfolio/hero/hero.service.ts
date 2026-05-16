import { Injectable } from '@nestjs/common';
import { Hero, HeroModel } from 'src/common/db/models/portfolio/hero/hero.model';
import { ErrorCodes } from 'src/common/filter/common.error';
import { CommonService } from '../../common.service';

@Injectable({})
export class HeroService extends CommonService<Hero> {
    constructor() {
        super(HeroModel, ErrorCodes.HERO, ErrorCodes.HERO + 1);
    }

    async getOne() {
        let hero = await this.findOne({});
        if (!hero) {
            hero = await this.model.create({
                full_name: 'Your Name',
                main_headline: { en: '', uz: '', ru: '' },
                sub_headline: { en: '', uz: '', ru: '' },
                profile_image_url: '',
            } as Hero);
        }
        return hero;
    }

    async patchOne(data: Partial<Hero>) {
        const hero = await this.getOne();
        return await this.updateOne(hero._id, data);
    }
}

export const heroService = new HeroService();
