import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { LanguageDto } from 'src/common/validation/dto/language.dto';

export class HeroDto {
    @ApiProperty({ type: String, example: 'John Doe' })
    @IsString()
    full_name: string;

    @ApiProperty({ type: LanguageDto })
    @ValidateNested()
    @Type(() => LanguageDto)
    main_headline: LanguageDto;

    @ApiProperty({ type: LanguageDto })
    @ValidateNested()
    @Type(() => LanguageDto)
    sub_headline: LanguageDto;

    @ApiProperty({ type: String, example: 'uploads/profile.png' })
    @IsString()
    profile_image_url: string;

    @ApiProperty({ type: String, required: false, example: 'uploads/resume.pdf' })
    @IsString()
    @IsOptional()
    resume_pdf_url?: string;
}

export class HeroUpdateDto extends PartialType(HeroDto) {}
