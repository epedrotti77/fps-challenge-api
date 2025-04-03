import { Injectable } from '@nestjs/common';
import { parseLog } from './parser/log-parser';

@Injectable()
export class LogsService {
  async processLogFile(file: Express.Multer.File) {
    const content = file.buffer.toString('utf-8');
    const matches = parseLog(content);
    return matches;
  }
}
