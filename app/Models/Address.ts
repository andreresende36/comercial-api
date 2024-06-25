import { DateTime } from 'luxon';
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import Client from './Client';

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public address: string;

  @column()
  public number: string;

  @column()
  public complement: string;

  @column()
  public neighborhood: string;

  @column({ columnName: 'zip_code' })
  public zipCode: string;

  @column()
  public city: string;

  @column()
  public state: string;

  @column()
  public country: string;

  @column({ columnName: 'client_id' })
  public clientId: number;

  @belongsTo(() => Client, {
    foreignKey: 'clientId',
  })
  public client: BelongsTo<typeof Client>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
