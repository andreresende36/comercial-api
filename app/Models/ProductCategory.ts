import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import Product from './Product';
import { DateTime } from 'luxon';

export default class ProductCategory extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column({ columnName: 'category_name' })
  public categoryName: string;

  @hasMany(() => Product, {
    foreignKey: 'categoryId',
  })
  public products: HasMany<typeof Product>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
