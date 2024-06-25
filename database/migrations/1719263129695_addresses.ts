import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Addresses extends BaseSchema {
  protected tableName = 'addresses';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string('address').notNullable();
      table.string('number');
      table.string('complement');
      table.string('neighborhood');
      table.string('zip_code').notNullable();
      table.string('city').notNullable();
      table.string('state').notNullable();
      table.string('country').notNullable();
      table
        .integer('client_id')
        .unsigned()
        .references('id')
        .inTable('clients')
        .notNullable();
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
