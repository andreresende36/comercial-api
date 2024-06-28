import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AddDeletedAtToProducts extends BaseSchema {
  protected tableName = 'products';

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('deleted_at', { useTz: true }).nullable();
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('deleted_at');
    });
  }
}
