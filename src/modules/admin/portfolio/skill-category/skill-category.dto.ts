import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, ValidateNested } from 'class-validator';
import { LanguageDto } from 'src/common/validation/dto/language.dto';

export class SkillCategoryDto {
    @ApiProperty({ type: LanguageDto })
    @ValidateNested()
    @Type(() => LanguageDto)
    title: LanguageDto;

    @ApiProperty({ type: Number, example: 0, required: false })
    @IsInt()
    @IsOptional()
    order_index?: number;
}

export class SkillCategoryUpdateDto extends PartialType(SkillCategoryDto) {}
