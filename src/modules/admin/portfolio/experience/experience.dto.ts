import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { LanguageDto } from 'src/common/validation/dto/language.dto';

export class ExperienceDto {
    @ApiProperty({ type: LanguageDto })
    @ValidateNested()
    @Type(() => LanguageDto)
    job_title: LanguageDto;

    @ApiProperty({ type: String, example: 'Acme Inc.' })
    @IsString()
    company_name: string;

    @ApiProperty({ type: LanguageDto })
    @ValidateNested()
    @Type(() => LanguageDto)
    employment_type: LanguageDto;

    @ApiProperty({ type: String, example: 'Jul 2025' })
    @IsString()
    start_date: string;

    @ApiProperty({ type: LanguageDto })
    @ValidateNested()
    @Type(() => LanguageDto)
    end_date: LanguageDto;

    @ApiProperty({ type: LanguageDto })
    @ValidateNested()
    @Type(() => LanguageDto)
    description: LanguageDto;

    @ApiProperty({ type: Number, example: 0, required: false })
    @IsInt()
    @IsOptional()
    order_index?: number;
}

export class ExperienceUpdateDto extends PartialType(ExperienceDto) {}
