import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLog(@UploadedFile() file: Express.Multer.File) {
    return this.logsService.processLogFile(file);
  }
}
