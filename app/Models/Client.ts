import { DateTime } from 'luxon';
import {
  column,
  BaseModel,
  hasMany,
  HasMany,
  beforeDelete,
} from '@ioc:Adonis/Lucid/Orm';
import Address from './Address';
import Phone from './Phone';
import Purchase from './Purchase';

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public cpf: string;

  @column()
  public sex: string;

  @column.date()
  public birthdate: DateTime;

  @hasMany(() => Address, {
    foreignKey: 'clientId',
  })
  public addresses: HasMany<typeof Address>;

  @hasMany(() => Phone, {
    foreignKey: 'clientId',
  })
  public phones: HasMany<typeof Phone>;

  @hasMany(() => Purchase, {
    foreignKey: 'clientId',
  })
  public purchases: HasMany<typeof Purchase>;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;

  @beforeDelete()
  public static async deleteRelated(client: Client) {
    await client.related('addresses').query().delete();
    await client.related('phones').query().delete();
    await client.related('purchases').query().delete();
  }
}
