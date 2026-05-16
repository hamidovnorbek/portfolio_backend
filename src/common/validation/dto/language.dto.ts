import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LanguageDto {
    @ApiProperty({ type: String, required: false, example: 'English value' })
    @IsString()
    @IsOptional()
    en?: string;

    @ApiProperty({ type: String, required: false, example: "O'zbekcha qiymat" })
    @IsString()
    @IsOptional()
    uz?: string;

    @ApiProperty({ type: String, required: false, example: 'Русское значение' })
    @IsString()
    @IsOptional()
    ru?: string;
}
