import { Injectable } from '@nestjs/common';
import { CreateItemDTO } from './dto/create-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './database/entities/item.entity';
import { Repository } from 'typeorm';
import { GetCatalogDTO } from './dto/get-catalog.dto';
import { ChangeItemNameDTO } from './dto/change-item-name.dto';
import { ChangeItemDescriptionDTO } from './dto/change-item-description.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  createItem(dto: CreateItemDTO) {
    return this.itemRepository.save(dto);
  }

  getCatalog(query: GetCatalogDTO) {
    return this.itemRepository.find({
      skip: query.page * query.page_size,
      take: query.page_size,
    });
  }

  changeItemName(id: string, dto: ChangeItemNameDTO) {
    return this.itemRepository.update(id, dto);
  }

  changeItemDescription(id: string, dto: ChangeItemDescriptionDTO) {
    return this.itemRepository.update(id, dto);
  }
}
