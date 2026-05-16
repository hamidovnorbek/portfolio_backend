import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { LanguageDto } from 'src/common/validation/dto/language.dto';

export class ProjectDto {
    @ApiProperty({ type: LanguageDto })
    @ValidateNested()
    @Type(() => LanguageDto)
    title: LanguageDto;

    @ApiProperty({ type: LanguageDto })
    @ValidateNested()
    @Type(() => LanguageDto)
    description: LanguageDto;

    @ApiProperty({ type: String, example: 'uploads/thumbnail.png' })
    @IsString()
    thumbnail_url: string;

    @ApiProperty({ type: [String], example: ['TypeScript', 'NestJS', 'MongoDB'] })
    @IsArray()
    @ArrayMinSize(0)
    @IsString({ each: true })
    tech_stack: string[];

    @ApiProperty({ type: String, required: false, example: 'https://github.com/owner/repo' })
    @IsString()
    @IsOptional()
    github_url?: string;

    @ApiProperty({ type: String, required: false, example: 'https://example.com' })
    @IsString()
    @IsOptional()
    live_url?: string;

    @ApiProperty({ type: Number, example: 0, required: false })
    @IsInt()
    @IsOptional()
    order_index?: number;
}

export class ProjectUpdateDto extends PartialType(ProjectDto) {}
