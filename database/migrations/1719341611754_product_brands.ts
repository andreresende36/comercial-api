import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class ProductBrands extends BaseSchema {
  protected tableName = 'product_brands';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string('brand_name').notNullable();
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
