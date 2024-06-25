import { DateTime } from 'luxon';
import { column, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import Address from './Address';
import Phone from './Phone';

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public cpf: string;

  @column()
  public sex: string;

  @hasMany(() => Address, {
    foreignKey: 'clientId',
  })
  public addresses: HasMany<typeof Address>;

  @hasMany(() => Phone, {
    foreignKey: 'clientId',
  })
  public phones: HasMany<typeof Phone>;

  @column.date({ columnName: 'birthdate' })
  public birthdate: DateTime;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
