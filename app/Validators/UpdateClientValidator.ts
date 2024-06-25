import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class CreateClientValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional({}, [rules.minLength(4)]),
    cpf: schema.string.optional({}, [rules.cpf()]),
    sex: schema.string.optional({}, [rules.sex()]),
    birthdate: schema.date.optional(),
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
    phoneNumber: schema.string.optional({}, [rules.regex(/^\d{10,15}$/)]),
  });

  public messages: CustomMessages = {};
}
