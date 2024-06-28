import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AddDeletedAtToPurchases extends BaseSchema {
  protected tableName = 'purchases';

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
