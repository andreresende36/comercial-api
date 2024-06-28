import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  scope,
  HasMany,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm';
import ProductCategory from './ProductCategory';
import ProductBrand from './ProductBrand';
import Purchase from './Purchase';
import { DateTime } from 'luxon';

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public price: number;

  @column()
  public name: string;

  @column()
  public description: string;

  @column()
  public stock: number;

  @column({ columnName: 'category_id' })
  public categoryId: number;

  @belongsTo(() => ProductCategory, {
    foreignKey: 'categoryId',
  })
  public category: BelongsTo<typeof ProductCategory>;

  @column({ columnName: 'brand_id' })
  public brandId: number;

  @belongsTo(() => ProductBrand, {
    foreignKey: 'brandId',
  })
  public brand: BelongsTo<typeof ProductBrand>;

  @hasMany(() => Purchase, {
    foreignKey: 'productId',
  })
  public purchases: HasMany<typeof Purchase>;

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
