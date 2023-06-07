import { Controller, Get, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { PinService } from './pin.service';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { FormDataTestDto } from './dto/formDataTestDto';

@Controller('pin')
export class PinController {
    constructor(private readonly pinService: PinService) {}

    @Get()
    async getAuth(@Res() res: Response) {
        try {
            const response = await this.pinService.getAuth();
            return res.status(HttpStatus.OK).json({
                data: response,
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: 'Failed to retrieve authentication',
            });
        }
    }

    @Post()
    @FormDataRequest({ storage: FileSystemStoredFile })
    async pinImage(@Res() res: Response, @Body() body: FormDataTestDto) {
        try {
            const { path } = body.image;
            const response = await this.pinService.pinImage(path);
            return res.status(HttpStatus.CREATED).json({
                data: response,
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: 'Failed to pin image',
            });
        }
    }
}
