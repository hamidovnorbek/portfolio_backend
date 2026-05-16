import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsEnum,
    IsOptional,
    IsPhoneNumber,
    IsString,
    MinLength,
    ValidateIf,
} from 'class-validator';
import { Types } from 'mongoose';
import { DOC_ID, DOC_PHONE_NUMBER } from 'src/common/constant/doc.constants';
import { EmployeeType } from 'src/common/db/models/employee/employee.model';
import { BaseIdDto, PagingDto } from 'src/common/validation/common.dto';
import { IsMongoIdCustom } from 'src/common/validation/custom/IsMongoId';
import { PersonDto } from 'src/common/validation/dto/person.dto';

export class EmployeeDto extends PersonDto {
    @ApiProperty({ enum: EmployeeType, type: String })
    @IsEnum(EmployeeType)
    type: EmployeeType;

    @ApiProperty({ example: '123456', type: String })
    @Transform(({ value }) => (value ? value?.trim() : value))
    @MinLength(6)
    @IsString()
    password: string;

    @ValidateIf((o) => o.type === EmployeeType.EMPLOYEE)
    @ApiProperty({ type: [String] })
    @IsMongoIdCustom({ each: true })
    @IsArray()
    @ArrayMinSize(1)
    organization_ids: Types.ObjectId[];

    @ValidateIf((o) => o.type === EmployeeType.ADMIN)
    @ApiProperty({ type: String, example: DOC_ID })
    @IsMongoIdCustom()
    role_id: Types.ObjectId;
}

export class EmployeeLoginDto {
    @ApiProperty({ example: DOC_PHONE_NUMBER, type: String })
    @Transform(({ value }) => (value ? '+' + value.replace(/[^0-9]/g, '') : value))
    @IsPhoneNumber()
    phone_number: string;

    @ApiProperty({ example: '123456', type: String })
    @Transform(({ value }) => (value ? value?.trim() : value))
    @MinLength(6)
    @IsString()
    password: string;
}

export class EmployeeGetDto extends PagingDto {
    @ApiProperty({ example: DOC_ID, type: String })
    @IsMongoIdCustom()
    @IsOptional()
    organization_id: Types.ObjectId;

    @ApiProperty({ enum: EmployeeType, type: String })
    @IsEnum(EmployeeType)
    @IsOptional()
    type: EmployeeType;
}

export class EmployeeUpdateDto extends IntersectionType(BaseIdDto, PartialType(EmployeeDto)) {}
