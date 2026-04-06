/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/await-thenable */
import { Body, Controller, Get, Injectable, Param, Post } from '@nestjs/common';
import { CreateOrderDto } from './order.dto';
import { SepayService } from 'src/shared/sepay.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities';
import { Repository } from 'typeorm';

@Controller('api/orders')
@Injectable()
export class OrderController {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly sepayService: SepayService,
  ) {}

  @Post()
  async create(@Body() body: CreateOrderDto) {
    const order = new Order();
    order.amount = body.amount;
    order.note = body.note;
    const resOrder = await this.orderRepo.save(order);
    const { html } = await this.sepayService.createOrder(resOrder);
    await this.orderRepo.update(Number(resOrder.id), { template: html });
    return this.orderRepo.findOneBy({ id: Number(resOrder.id) });
  }

  @Get(':id')
  async getOrder(@Param('id') id: any) {
    const order = await this.orderRepo.findOne({
      where: [{ id: id }, { traction_uuid: id }],
    });
    return order;
  }
}
