import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class UpdateAddressValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string.optional. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string.optional([ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string.optional, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string.optional([
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    address: schema.string.optional({}),
    number: schema.string.optional({}),
    complement: schema.string.optional({}),
    neighborhood: schema.string.optional({}),
    zipCode: schema.string.optional({}, [rules.regex(/^\d{8}$/)]),
    city: schema.string.optional({}),
    state: schema.string.optional({}, [
      rules.minLength(2),
      rules.maxLength(2),
      rules.regex(/^[^\d]+$/),
    ]),
    country: schema.string.optional({}),
  });

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {};
}
