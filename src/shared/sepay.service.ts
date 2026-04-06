/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SePayPgClient } from 'sepay-pg-node';
import { Order } from 'src/entities';
import { StringUtil } from 'src/util/string.util';
import { Repository } from 'typeorm';

@Injectable()
export class SepayService {
  private readonly client = new SePayPgClient({
    //@ts-ignore
    env: process.env.SEPAY_ENV || 'sandbox',
    merchant_id: String(process.env.SEPAY_MERCHANT_ID),
    secret_key: String(process.env.SEPAY_SECRET_KEY),
  });

  protected readonly checkoutURL = this.client.checkout.initCheckoutUrl();
  protected readonly urlCancel = String(process.env.SEPAY_URL_CANCEL);

  protected readonly ORDER_STATUS = {
    CAPTURED: 'CAPTURED',
    CANCELLED: 'CANCELLED',
    AUTHENTICATION_NOT_NEEDED: 'AUTHENTICATION_NOT_NEEDED',
  };

  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) { }

  createOrder(order: Order) {
    const orderId = String(order.traction_uuid);
    const fields = this.client.checkout.initOneTimePaymentFields({
      operation: 'PURCHASE',
      payment_method: 'BANK_TRANSFER',
      order_invoice_number: orderId,
      order_amount: order.amount || 0,
      currency: 'VND',
      order_description: `Thanh toan don hang DH: ${orderId}`,
      success_url: `${this.urlCancel}/ket-qua-thanh-toan/${orderId}`,
      error_url: `${this.urlCancel}?orderId=${orderId}`,
      cancel_url: `${this.urlCancel}?orderId=${orderId}`,
    });
    const inputs = Object.entries(fields)
      .map(
        ([k, v]) =>
          `<input type="hidden" name="${StringUtil.escapeHtml(k)}" value="${StringUtil.escapeHtml(v)}" />`,
      )
      .join('\n');
    const html = `<!doctype html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
      <body>
      <p>Đang chuyển đến trang thanh toán production...</p>
      <form id="sepay_form" method="POST" action="${StringUtil.escapeHtml(this.checkoutURL)}">
      ${inputs}
      <noscript><button type="submit">Tiếp tục</button></noscript>
      </form>
      <script>document.getElementById('sepay_form').submit();</script>
      </body>
      </html>`;
    return { fields, html };
  }

  async inpNotify(data: any) {
    const status = data.order?.order_status;
    const traction_uuid = data.order?.order_invoice_number;
    let orderStatus = Order.STATUS.PENDING;
    if (status === this.ORDER_STATUS.CAPTURED) {
      orderStatus = Order.STATUS.PAID;
    } else {
      orderStatus = Order.STATUS.CANCELLED;
    }
    try {
      await this.orderRepo.createQueryBuilder().update(Order)
        .set({
          status: orderStatus,
          order: JSON.stringify(data.order),
          transaction: JSON.stringify(data.transaction),
        })
        .where("traction_uuid = :traction_uuid", { traction_uuid })
        .execute()
    } catch (error) {
      console.log(error)
    }
    return;
  }
}
