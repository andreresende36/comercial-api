import { DateTime } from 'luxon';
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import Client from './Client';

export default class Phone extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column({ columnName: 'phone_number' })
  public phoneNumber: string;

  @column({ columnName: 'client_id' })
  public clientId: number;

  @belongsTo(() => Client, {
    foreignKey: 'clientId',
  })
  public client: BelongsTo<typeof Client>;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;
}
