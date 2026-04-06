/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api/api.module';
import { SharedModule } from './shared/shared.module';
import { WebhookModule } from './webhook/webhook.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MysqlOrmAsyncConfig } from 'database/mysql.database';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(MysqlOrmAsyncConfig),
    ApiModule,
    SharedModule,
    WebhookModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
