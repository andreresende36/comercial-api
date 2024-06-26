import { DateTime } from 'luxon';
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm';
import Client from './Client';
import Product from './Product';

export default class Purchase extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public quantity: number;

  @column({ columnName: 'unit_price' })
  public unitPrice: number;

  @column({ columnName: 'total_price' })
  public totalPrice: number;

  @column.date()
  public date: DateTime;

  @column.dateTime()
  public time: DateTime;

  @column({ columnName: 'client_id' })
  public clientId: number;

  @belongsTo(() => Client, {
    foreignKey: 'clientId',
  })
  public client: BelongsTo<typeof Client>;

  @manyToMany(() => Product, {
    pivotTable: 'purchase_products',
    localKey: 'id',
    pivotForeignKey: 'purchase_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'product_id',
    pivotTimestamps: true,
  })
  public products: ManyToMany<typeof Product>;
}
