import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ItemStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  UNAVAILABLE = 'unavailable',
}

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  catalog_item_id: string;

  @Column({ type: String, default: ItemStatus.AVAILABLE })
  status: ItemStatus;
}
