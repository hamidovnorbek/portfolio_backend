import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { DOC_ID } from 'src/common/constant/doc.constants';
import { CalculationMethod } from 'src/common/db/models/finance/currency/currency-value/currency-value.model';
import { CurrencySide } from 'src/common/db/models/finance/currency/currency.model';
import { BaseDto, BaseIdDto, PagingDto } from 'src/common/validation/common.dto';
import { IsMongoIdCustom } from 'src/common/validation/custom/IsMongoId';

export class CurrencyValuesDto {
    @ApiProperty({ type: String, example: DOC_ID })
    @IsMongoIdCustom()
    to_currency_id: Types.ObjectId;

    @ApiProperty({ type: Number, minimum: 0, example: 12000 })
    @IsNumber({ allowInfinity: false, allowNaN: false })
    @IsPositive()
    value: number;

    from_currency_id: Types.ObjectId;
    numerator?: number;
    denominator?: number;
    created_by?: Types.ObjectId;
    updated_by?: Types.ObjectId;
}

export class CurrencyDto extends BaseDto {
    @ApiProperty({ type: String, example: 'Dollar' })
    @IsString()
    name: string;

    @ApiProperty({ type: String, required: false, example: '$' })
    @IsString()
    @IsOptional()
    symbol: string;

    @ApiProperty({ enum: CurrencySide, example: CurrencySide.END })
    @IsEnum(CurrencySide)
    side: CurrencySide;

    @ApiProperty({ type: [CurrencyValuesDto], required: false, isArray: true, example: [new CurrencyValuesDto()] })
    @Transform(({ value }) => (!value ? [] : value))
    @Type(() => CurrencyValuesDto)
    @IsArray()
    @ValidateNested()
    @IsOptional()
    currency_values: CurrencyValuesDto[];

    last_updated_at?: Date;
    is_main: boolean;
}

export class CurrencyGetDto extends PagingDto {}

export class CurrencyUpdateDto extends IntersectionType(BaseIdDto, CurrencyDto) {}
