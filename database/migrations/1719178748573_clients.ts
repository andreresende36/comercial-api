import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Clients extends BaseSchema {
  protected tableName = 'clients';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('name').notNullable();
      table.string('cpf').notNullable().unique();
      table.string('sex').notNullable();
      table.date('birth_date').notNullable();
      table.timestamp('created_at', { useTz: true }).notNullable();
      table.timestamp('updated_at', { useTz: true }).notNullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
