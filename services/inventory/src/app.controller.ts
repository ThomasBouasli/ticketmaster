import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateItemDTO } from './dto/create-item.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  createItem(@Body() body: CreateItemDTO) {
    return this.appService.createItem(body);
  }

  @Get('reservation-timeout')
  reservationTimeout() {
    return this.appService.getReservationTimeout();
  }

  @Get(':catalog_item_id')
  getInventory(@Param('catalog_item_id') catalog_item_id: string) {
    return this.appService.getItemCount(catalog_item_id);
  }

  @Post(':catalog_item_id/decrease')
  decreaseCatalog(
    @Param('catalog_item_id') catalog_item_id: string,
    @Body('quantity') quantity: number,
  ) {
    return this.appService.decreaseItemInventory(catalog_item_id, quantity);
  }

  @Post(':catalog_item_id/increase')
  increaseCatalog(
    @Param('catalog_item_id') catalog_item_id: string,
    @Body('quantity') quantity: number,
  ) {
    return this.appService.increaseItemInventory(catalog_item_id, quantity);
  }

  @Post(':catalog_item_id/reserve')
  reserveCatalog(@Param('catalog_item_id') catalog_item_id: string) {
    return this.appService.reserveAnItem(catalog_item_id);
  }
}
