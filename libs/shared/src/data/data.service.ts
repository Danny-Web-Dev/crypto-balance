import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { FsUtilService } from '@app/shared/utils/fs-util.service';
import { UserBalances } from '@app/shared/interfaces/balance/user-balance';
@Injectable()
export class DataService {
  constructor(private fsUtilService: FsUtilService) {}
  private readonly filePath = join(__dirname, '../../../libs/shared/src/data/balances.json');

  async getAllData(): Promise<UserBalances> {
    return await this.fsUtilService.readFile<UserBalances>(this.filePath);
  }
  async updateData(data: UserBalances): Promise<void> {
    await this.fsUtilService.writeData<UserBalances>(this.filePath, data);
  }
}
