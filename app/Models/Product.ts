import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm';
import ProductCategory from './ProductCategory';
import ProductBrand from './ProductBrand';
import Purchase from './Purchase';

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

  @manyToMany(() => Purchase, {
    pivotTable: 'purchase_products',
    localKey: 'id',
    pivotForeignKey: 'product_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'purchase_id',
    pivotTimestamps: true,
  })
  public purchases: ManyToMany<typeof Purchase>;
}
