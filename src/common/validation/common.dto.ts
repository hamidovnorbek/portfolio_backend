import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEnum, IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';
import { Types } from 'mongoose';
import { DOC_ID } from '../constant/doc.constants';
import { makeRegexableUtil } from '../utils/make-regexable.util';
import { transliterate } from '../utils/transliterate.util';
import { IsDateCustom } from './custom/IsDate';
import { IsGreaterDateCustom } from './custom/IsGreaterDate';
import { IsMongoIdCustom } from './custom/IsMongoId';

export class CommonSearchDto {
    @ApiProperty({ type: String, required: false })
    @IsOptional()
    @Expose({ toClassOnly: true })
    @Transform(({ value }) => {
        if (!value) return '';
        const search = makeRegexableUtil(value);
        const transliteratedSearch = transliterate(search);
        return new RegExp(`(${search}|${transliteratedSearch})`, 'i');
    })
    search?: string;
}

export class DateFilterDto {
    @ApiProperty({ type: String, example: '2022-10-25', required: false })
    @IsDateCustom()
    date_from?: Date;

    @ApiProperty({ type: String, example: '2022-10-25', required: false })
    @IsDateCustom()
    @IsGreaterDateCustom('date_from')
    date_to?: Date;
}

export enum AscAndDesc {
    asc = '1',
    desc = '-1',
}

export class PagingDto extends CommonSearchDto {
    @ApiProperty({ type: Number, example: 1 })
    @Transform(({ value }) => Number(value))
    @IsInt()
    @Min(1)
    page: number;

    @ApiProperty({ type: Number, example: 20 })
    @Transform(({ value }) => (value ? (Number(value) > 500 ? 500 : Number(value)) : value))
    @IsInt()
    @Min(1)
    limit: number;

    @ApiProperty({ type: String, example: '2022-10-25', required: false })
    @IsOptional()
    @IsDateCustom()
    date_from?: Date;

    @ApiProperty({ type: String, example: '2022-10-25', required: false })
    @IsOptional()
    @IsDateCustom()
    @IsGreaterDateCustom('date_from')
    date_to?: Date;

    @IsOptional()
    @IsString()
    sort_by?: string;

    @IsOptional()
    @IsEnum(AscAndDesc)
    asc?: AscAndDesc;

    accessed_organization_ids?: Types.ObjectId[];
}

export class BaseDto {
    created_by?: Types.ObjectId;
    updated_by?: Types.ObjectId;
    deleted_by?: Types.ObjectId;
    created_at?: Date;
    updated_at?: Date;
}

export class BaseIdDto {
    @ApiProperty({ type: String, example: DOC_ID })
    @IsMongoIdCustom()
    _id: Types.ObjectId;
}

export class ValidationErrorData {
    property: string;
    message?: string;
}

export class FileDto {
    @IsString()
    @Matches(/\.xlsx$/, { message: 'file_path must be an .xlsx file' })
    file_path: string;
}

export class ImportDto extends IntersectionType(BaseIdDto, FileDto) {}
export class DynamicImportDto extends FileDto {
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    columns: string[];
}

export class GetDeletedDto {
    @ApiProperty({ type: String, example: '2022-10-25', required: false })
    @IsDateCustom()
    deleted_at?: Date;
}
