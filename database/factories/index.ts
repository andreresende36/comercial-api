import Factory from '@ioc:Adonis/Lucid/Factory';
import Client from 'App/Models/Client';
import User from 'App/Models/User';
import { faker, fakerPT_BR } from '@faker-js/faker';
import * as fakerBr from 'faker-br';
import { DateTime } from 'luxon';

export const UserFactory = Factory.define(User, () => {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
    avatar: faker.internet.url(),
  };
}).build();

export const ClientFactory = Factory.define(Client, () => {
  return {
    name: fakerPT_BR.person.fullName(),
    cpf: fakerBr.br.cpf(),
    sex: fakerPT_BR.person.sex(),
    birthdate: DateTime.fromJSDate(
      faker.date.birthdate({ min: 18, max: 70, mode: 'age' }),
    ),
  };
}).build();
