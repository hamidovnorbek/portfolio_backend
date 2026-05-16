import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class ContactMessageDto {
    @ApiProperty({ type: String, example: 'Jane Doe' })
    @IsString()
    @MinLength(2)
    @MaxLength(120)
    sender_name: string;

    @ApiProperty({ type: String, example: 'jane@example.com' })
    @IsEmail()
    sender_email: string;

    @ApiProperty({ type: String, example: 'Hello, I would like to discuss a project...' })
    @IsString()
    @MinLength(5)
    @MaxLength(5000)
    message: string;
}
