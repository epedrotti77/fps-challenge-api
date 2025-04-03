import { Injectable } from '@nestjs/common';
import { ProcessLogUseCase } from './use-cases/process-log.usecase';

@Injectable()
export class LogsService {
  constructor(private readonly processLogUseCase: ProcessLogUseCase) {}

  async processLogFile(file: Express.Multer.File) {
    const content = file.buffer.toString('utf-8');
    await this.processLogUseCase.execute(content);
    return { message: 'Log processado com sucesso' };
  }
}
