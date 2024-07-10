import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDTO } from './dto/create-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './database/entities/item.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  createItem(dto: CreateItemDTO) {
    return this.itemRepository.save(dto);
  }

  async getItem(catalog_item_id: string) {
    const found = await this.itemRepository.findOne({
      where: { catalog_item_id },
    });

    if (!found) {
      throw new NotFoundException('Item not found');
    }

    return found;
  }

  getItems(catalog_item_ids: string[]) {
    return this.itemRepository.find({
      where: { catalog_item_id: In(catalog_item_ids) },
    });
  }

  async increasePrice(catalog_item_id: string, price: number) {
    const current = await this.itemRepository.findOne({
      where: { catalog_item_id },
    });

    return this.itemRepository.update(
      { catalog_item_id },
      { price: current.price + price },
    );
  }

  async decreasePrice(catalog_item_id: string, price: number) {
    const current = await this.itemRepository.findOne({
      where: { catalog_item_id },
    });

    if (current.price < price) {
      throw new Error('Cannot decrease price below 0');
    }

    return this.itemRepository.update(
      { catalog_item_id },
      { price: current.price - price },
    );
  }
}
