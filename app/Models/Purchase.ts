import { DateTime } from 'luxon';
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  scope,
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

  @column({ columnName: 'product_id' })
  public productId: number;

  @belongsTo(() => Client, {
    foreignKey: 'clientId',
  })
  public client: BelongsTo<typeof Client>;

  @belongsTo(() => Product, {
    foreignKey: 'productId',
  })
  public product: BelongsTo<typeof Product>;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime | null;

  public static ignoreDeleted = scope((query) => {
    query.whereNull('deletedAt');
  });

  public async delete() {
    this.deletedAt = DateTime.local();
    await this.save();
  }
}
