import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import Product from './Product';
import { DateTime } from 'luxon';

export default class ProductBrand extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column({ columnName: 'brand_name' })
  public brandName: string;

  @hasMany(() => Product, {
    foreignKey: 'brandId',
  })
  public products: HasMany<typeof Product>;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;
}
