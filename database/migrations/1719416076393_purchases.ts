// database/migrations/xxxx_create_purchases.ts
import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Purchases extends BaseSchema {
  protected tableName = 'purchases';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.integer('quantity').notNullable();
      table.float('unit_price').notNullable();
      table.float('total_price');
      table.date('date').notNullable();
      table.time('time').notNullable();
      table
        .integer('client_id')
        .unsigned()
        .references('clients.id')
        .onDelete('CASCADE')
        .notNullable();
      table
        .integer('product_id')
        .unsigned()
        .references('products.id')
        .onDelete('CASCADE')
        .notNullable();
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
