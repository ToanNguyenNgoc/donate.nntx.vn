import { Controller, Get, Render, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('homepage')
  getHello() {
    return {
      message: this.appService.getHello(),
      title: 'Trang chủ',
    };
  }

  @Get('ket-qua-thanh-toan/:id')
  @Render('order-status')
  getOrderStatus(@Param('id') id: string) {
    return { orderId: id };
  }
}
