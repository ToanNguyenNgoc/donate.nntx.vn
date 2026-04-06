import { Global, Module } from '@nestjs/common';
import { SepayService } from './sepay.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [SepayService],
  exports: [SepayService],
})
export class SharedModule {}
