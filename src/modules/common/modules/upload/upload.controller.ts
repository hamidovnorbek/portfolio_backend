import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { AuthAdminGuard } from 'src/modules/common/guard/auth.guard';
import { UploadDto } from './upload.dto';

@ApiTags('Upload file')
@Controller('upload')
export class UploadController {
    constructor() {}

    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UploadDto })
    @UseGuards(AuthAdminGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Post('')
    async upload(@UploadedFile() file: Express.Multer.File) {
        const uploadsFolder = path.resolve('uploads');
        if (!fs.existsSync(uploadsFolder)) {
            fs.mkdirSync(uploadsFolder);
        }
        const timestamp = new Date().getTime();
        const fileext = path.extname(file.originalname).toLocaleLowerCase();
        const filename = `${timestamp}${fileext}`;
        const imagePath = `uploads/${filename}`;
        const imageUrl = path.resolve(imagePath);

        fs.writeFileSync(imageUrl, file.buffer);

        return imagePath;
    }
}
