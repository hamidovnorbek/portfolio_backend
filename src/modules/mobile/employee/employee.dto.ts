import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { DOC_PHONE_NUMBER } from 'src/common/constant/doc.constants';

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

export class EmployeeProfileUpdateDto {
    @ApiProperty({ example: 'John Doe', type: String, required: false })
    @IsString()
    full_name?: string;
}
