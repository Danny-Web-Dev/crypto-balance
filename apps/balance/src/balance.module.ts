import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { SharedModule } from '@app/shared/shared.module';
import { UserIdMiddleware } from '@app/shared/middlewares/user-id.middleware';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), SharedModule],
  controllers: [BalanceController],
  providers: [BalanceService],
})
export class BalanceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserIdMiddleware).forRoutes(BalanceController);
  }
}
