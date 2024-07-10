import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './catalog.sqlite',
      entities: [Item],
      synchronize: true,
      dropSchema: true,
    }),
    TypeOrmModule.forFeature([Item]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
