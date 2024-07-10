import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateItemDTO } from './dto/create-item.dto';
import { GetCatalogDTO } from './dto/get-catalog.dto';
import { ChangeItemNameDTO } from './dto/change-item-name.dto';
import { ChangeItemDescriptionDTO } from './dto/change-item-description.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  createItem(@Body() body: CreateItemDTO) {
    return this.appService.createItem(body);
  }

  @Get()
  getCatalog(@Query() query: GetCatalogDTO) {
    return this.appService.getCatalog(query);
  }

  @Put(':id/change-name')
  changeItemName(@Param('id') id: string, @Body() body: ChangeItemNameDTO) {
    return this.appService.changeItemName(id, body);
  }

  @Put(':id/change-description')
  changeItemDescription(
    @Param('id') id: string,
    @Body() body: ChangeItemDescriptionDTO,
  ) {
    return this.appService.changeItemDescription(id, body);
  }
}
