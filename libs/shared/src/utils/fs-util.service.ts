import { Injectable } from '@nestjs/common';
import { promises as fsPromises } from 'fs';
import { ServerError } from '@app/shared/errors/server-error';
import ErrorType from '@app/shared/errors/error-type';
import { LoggingService } from '@app/shared/log/log.service';

@Injectable()
export class FsUtilService {
  constructor(private readonly loggingService: LoggingService) {
  }

  public async fileExists(filePath: string): Promise<boolean> {
    try {
      await fsPromises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  public async readFile<T>(filePath: string, options: object = { encoding: 'utf8', flag: undefined }): Promise<T> {
    try {
      const fileContent = await fsPromises.readFile(filePath, options);
      return JSON.parse(fileContent as unknown as string) as T;
    } catch (error: any) {
      this.loggingService.error<any>(error);
      throw new ServerError(ErrorType.UNABLE_TO_READ_FILE.message, ErrorType.UNABLE_TO_READ_FILE.errorCode);
    }
  }

  public async writeData<T>(
    filePath: string,
    data: T,
    options: object = { encoding: 'utf8', flag: undefined, flush: undefined },
  ): Promise<void> {
    const dataStr = JSON.stringify(data);
    try {
      return await fsPromises.writeFile(filePath, dataStr, options);
    } catch (error: any) {
      console.error(error);
      throw new ServerError(
        ErrorType.UNABLE_TO_WRITE_TO_FILE.message,
        ErrorType.UNABLE_TO_WRITE_TO_FILE.errorCode,
        `File path: ${filePath}`,
      );
    }
  }
}
