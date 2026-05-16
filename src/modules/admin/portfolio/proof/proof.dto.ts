import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { IsDateCustom } from 'src/common/validation/custom/IsDate';
import { LanguageDto } from 'src/common/validation/dto/language.dto';

export class ProofDto {
    @ApiProperty({ type: LanguageDto })
    @ValidateNested()
    @Type(() => LanguageDto)
    title: LanguageDto;

    @ApiProperty({ type: String, example: 'uploads/certificate.pdf' })
    @IsString()
    pdf_url: string;

    @ApiProperty({ type: String, required: false, example: 'uploads/thumb.png' })
    @IsString()
    @IsOptional()
    thumbnail_url?: string;

    @ApiProperty({ type: String, example: '2025-05-16' })
    @IsDateCustom()
    date_earned: Date;

    @ApiProperty({ type: Number, example: 0, required: false })
    @IsInt()
    @IsOptional()
    order_index?: number;
}

export class ProofUpdateDto extends PartialType(ProofDto) {}
