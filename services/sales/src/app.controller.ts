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

  @Get(':catalog_item_id')
  getCatalog(@Param('catalog_item_id') catalog_item_id: string) {
    return this.appService.getItem(catalog_item_id);
  }

  @Get()
  getCatalogs(@Body('catalog_item_ids') catalog_item_ids: string[]) {
    return this.appService.getItems(catalog_item_ids);
  }

  @Post(':catalog_item_id/increase')
  increaseCatalog(
    @Param('catalog_item_id') catalog_item_id: string,
    @Body('price') price: number,
  ) {
    return this.appService.increasePrice(catalog_item_id, price);
  }

  @Post(':catalog_item_id/decrease')
  decreaseCatalog(
    @Param('catalog_item_id') catalog_item_id: string,
    @Body('price') price: number,
  ) {
    return this.appService.decreasePrice(catalog_item_id, price);
  }
}
