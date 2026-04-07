import { Body, Controller, Post } from '@nestjs/common';
import { SepayService } from 'src/shared/sepay.service';

@Controller('webhook')
export class WebhookController {
  constructor(protected readonly sepayService: SepayService) {}
  @Post('sepay')
  async ipnSepay(@Body() body: any) {
    // await this.sepayService.inpNotify(body);
    // return true;
    console.log(body);
    return true;
  }
}
