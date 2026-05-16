import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { LanguageDto } from 'src/common/validation/dto/language.dto';

export class SocialLinksDto {
    @ApiProperty({ type: String, required: false })
    @IsString()
    @IsOptional()
    github?: string;

    @ApiProperty({ type: String, required: false })
    @IsString()
    @IsOptional()
    linkedin?: string;

    @ApiProperty({ type: String, required: false })
    @IsString()
    @IsOptional()
    telegram?: string;
}

export class NavigationLabelsDto {
    @ApiProperty({ type: LanguageDto, required: false })
    @ValidateNested()
    @Type(() => LanguageDto)
    @IsOptional()
    home?: LanguageDto;

    @ApiProperty({ type: LanguageDto, required: false })
    @ValidateNested()
    @Type(() => LanguageDto)
    @IsOptional()
    experience?: LanguageDto;

    @ApiProperty({ type: LanguageDto, required: false })
    @ValidateNested()
    @Type(() => LanguageDto)
    @IsOptional()
    skills?: LanguageDto;
}

export class CallToActionLabelsDto {
    @ApiProperty({ type: LanguageDto, required: false })
    @ValidateNested()
    @Type(() => LanguageDto)
    @IsOptional()
    view_projects?: LanguageDto;

    @ApiProperty({ type: LanguageDto, required: false })
    @ValidateNested()
    @Type(() => LanguageDto)
    @IsOptional()
    lets_talk?: LanguageDto;
}

export class SiteSettingsDto {
    @ApiProperty({ type: LanguageDto })
    @ValidateNested()
    @Type(() => LanguageDto)
    site_title: LanguageDto;

    @ApiProperty({ type: String })
    @IsString()
    logo_text: string;

    @ApiProperty({ type: String })
    @IsString()
    favicon_url: string;

    @ApiProperty({ type: SocialLinksDto })
    @ValidateNested()
    @Type(() => SocialLinksDto)
    social_links: SocialLinksDto;

    @ApiProperty({ type: NavigationLabelsDto })
    @ValidateNested()
    @Type(() => NavigationLabelsDto)
    navigation_labels: NavigationLabelsDto;

    @ApiProperty({ type: CallToActionLabelsDto })
    @ValidateNested()
    @Type(() => CallToActionLabelsDto)
    call_to_action_labels: CallToActionLabelsDto;

    @ApiProperty({ type: LanguageDto })
    @ValidateNested()
    @Type(() => LanguageDto)
    footer_copyright: LanguageDto;
}

export class SiteSettingsUpdateDto extends PartialType(SiteSettingsDto) {}
