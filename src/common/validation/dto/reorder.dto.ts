import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';
import { DOC_ID } from 'src/common/constant/doc.constants';
import { IsMongoIdCustom } from '../custom/IsMongoId';

export class ReorderItemDto {
    @ApiProperty({ type: String, example: DOC_ID })
    @IsMongoIdCustom()
    _id: Types.ObjectId;

    @ApiProperty({ type: Number, example: 0 })
    @IsInt()
    order_index: number;
}

export class ReorderDto {
    @ApiProperty({ type: [ReorderItemDto] })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => ReorderItemDto)
    items: ReorderItemDto[];
}
