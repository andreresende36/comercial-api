import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Products extends BaseSchema {
  protected tableName = 'products';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.decimal('price', 10, 2).notNullable();
      table.text('description').notNullable();
      table
        .integer('category_id')
        .unsigned()
        .references('product_categories.id')
        .onDelete('CASCADE')
        .notNullable();
      table
        .integer('brand_id')
        .unsigned()
        .references('product_brands.id')
        .onDelete('CASCADE')
        .notNullable();
      table.integer('stock').unsigned().defaultTo(0);
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
