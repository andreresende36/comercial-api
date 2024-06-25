import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class CreateAddressValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string([ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string([
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    address: schema.string({}),
    number: schema.string({}),
    complement: schema.string.optional({}),
    neighborhood: schema.string({}),
    zipCode: schema.string({}, [rules.regex(/^\d{8}$/)]),
    city: schema.string({}),
    state: schema.string({}, [
      rules.minLength(2),
      rules.maxLength(2),
      rules.regex(/^[^\d]+$/),
    ]),
    country: schema.string({}),
  });
}
