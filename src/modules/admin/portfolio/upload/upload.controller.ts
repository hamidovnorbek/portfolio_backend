import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { AuthUserGuard } from 'src/modules/common/guard/portfolio-auth.guard';
import { UploadDto } from 'src/modules/common/modules/upload/upload.dto';

@ApiTags('Upload')
@Controller('upload')
export class PortfolioUploadController {
    @Post()
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UploadDto })
    @UseGuards(AuthUserGuard)
    @UseInterceptors(FileInterceptor('file'))
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

        return { url: `/${imagePath}`, path: imagePath };
    }
}
