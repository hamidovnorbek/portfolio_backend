import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { DOC_LAST_NAME, DOC_PHONE_NUMBER } from 'src/common/constant/doc.constants';
import { BaseDto } from '../common.dto';

export class PersonDto extends BaseDto {
    @ApiProperty({ example: DOC_LAST_NAME, type: String })
    @IsString()
    @IsOptional()
    full_name: string;

    @ApiProperty({ example: DOC_PHONE_NUMBER, type: String })
    @Transform(({ value }) => (value ? '+' + value.replace(/[^0-9]/g, '') : value))
    @IsPhoneNumber()
    phone_number: string;

    @ApiProperty({ example: DOC_LAST_NAME, type: String, required: false })
    @IsString()
    @IsOptional()
    description: string;

    balance_currency_id: Types.ObjectId;
}
