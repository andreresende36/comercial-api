import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class CreateClientValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [rules.minLength(4)]),
    cpf: schema.string({}, [rules.cpf()]),
    sex: schema.string({}, [rules.sex()]),
    birthdate: schema.date(),
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
    phoneNumber: schema.string({}, [rules.regex(/^\d{10,15}$/)]),
  });

  public messages: CustomMessages = {};
}
