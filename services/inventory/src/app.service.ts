import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDTO } from './dto/create-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Item, ItemStatus } from './database/entities/item.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { SqsService } from './libs/sqs.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class AppService {
  constructor(
    private readonly config: ConfigService,
    private readonly sqs: SqsService,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async createItem(dto: CreateItemDTO) {
    const items = Array.from({ length: dto.quantity }).map(() =>
      this.itemRepository.create({
        catalog_item_id: dto.catalog_item_id,
      }),
    );

    await this.itemRepository.save(items);
  }

  async getItemCount(catalog_item_id: string) {
    const count = await this.itemRepository.count({
      where: { catalog_item_id, status: ItemStatus.AVAILABLE },
    });

    return { count };
  }

  async decreaseItemInventory(catalog_item_id: string, quantity: number) {
    const items_to_delete = await this.itemRepository.find({
      where: { catalog_item_id, status: ItemStatus.AVAILABLE },
      take: quantity,
    });

    if (items_to_delete.length < quantity) {
      throw new NotFoundException('Not enough items in inventory');
    }

    await this.itemRepository.remove(items_to_delete);
  }

  async increaseItemInventory(catalog_item_id: string, quantity: number) {
    const items = Array.from({ length: quantity }).map(() =>
      this.itemRepository.create({
        catalog_item_id,
        status: ItemStatus.AVAILABLE,
      }),
    );

    await this.itemRepository.save(items);
  }

  getReservationTimeout() {
    const timeout = this.config.get('RESERVATION_TIMEOUT');
    return { timeout };
  }

  async reserveAnItem(catalog_item_id: string) {
    const item = await this.itemRepository.findOne({
      where: { catalog_item_id, status: ItemStatus.AVAILABLE },
    });

    if (!item) {
      throw new NotFoundException('No items available');
    }

    item.status = ItemStatus.RESERVED;
    await this.itemRepository.save(item);

    await this.sqs.sendMessage(
      'reservation-cancellation',
      { id: item.id },
      Number(this.config.get('RESERVATION_TIMEOUT')),
    );
  }

  @OnEvent('reservation-cancellation')
  async cancelReservation(message: any, receipt: string) {
    const { id } = JSON.parse(message);

    const item = await this.itemRepository.findOne({
      where: {
        id,
      },
    });

    if (!item) {
      return;
    }

    item.status = ItemStatus.AVAILABLE;
    await this.itemRepository.save(item);

    await this.sqs.acknowledgeMessage(receipt);
  }
}
