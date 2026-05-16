import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';
import { DOC_ID } from 'src/common/constant/doc.constants';
import { IsMongoIdCustom } from 'src/common/validation/custom/IsMongoId';
import { LanguageDto } from 'src/common/validation/dto/language.dto';

export class MetricDto {
    @ApiProperty({ type: String, example: DOC_ID })
    @IsMongoIdCustom()
    hero_id: Types.ObjectId;

    @ApiProperty({ type: String, example: '99.7%' })
    @IsString()
    value: string;

    @ApiProperty({ type: LanguageDto })
    @ValidateNested()
    @Type(() => LanguageDto)
    label: LanguageDto;

    @ApiProperty({ type: LanguageDto })
    @ValidateNested()
    @Type(() => LanguageDto)
    description: LanguageDto;
}

export class MetricUpdateDto extends PartialType(MetricDto) {}
