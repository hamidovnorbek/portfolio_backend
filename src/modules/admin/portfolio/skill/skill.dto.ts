import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { DOC_ID } from 'src/common/constant/doc.constants';
import { IsMongoIdCustom } from 'src/common/validation/custom/IsMongoId';

export class SkillDto {
    @ApiProperty({ type: String, example: DOC_ID })
    @IsMongoIdCustom()
    category_id: Types.ObjectId;

    @ApiProperty({ type: String, example: 'TypeScript' })
    @IsString()
    name: string;

    @ApiProperty({ type: String, example: 'uploads/ts.svg' })
    @IsString()
    icon_url: string;

    @ApiProperty({ type: Number, example: 0, required: false })
    @IsInt()
    @IsOptional()
    order_index?: number;
}

export class SkillUpdateDto extends PartialType(SkillDto) {}
