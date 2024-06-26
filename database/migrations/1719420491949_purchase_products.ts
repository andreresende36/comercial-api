import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class PurchaseProducts extends BaseSchema {
  protected tableName = 'purchase_products';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('purchase_id')
        .unsigned()
        .notNullable()
        .references('purchases.id')
        .onDelete('CASCADE');
      table
        .integer('product_id')
        .unsigned()
        .notNullable()
        .references('products.id')
        .onDelete('CASCADE');
      table.primary(['purchase_id', 'product_id']);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
