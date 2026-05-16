import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({ type: String, example: 'admin' })
    @IsString()
    @Transform(({ value }) => (value ? value.toString().trim() : value))
    username: string;

    @ApiProperty({ type: String, example: '123456' })
    @IsString()
    @MinLength(6)
    @Transform(({ value }) => (value ? value.toString().trim() : value))
    password: string;
}

export class LoginResponseDto {
    @ApiProperty({ type: String })
    token: string;

    @ApiProperty({ type: String })
    username: string;
}
