import Factory from '@ioc:Adonis/Lucid/Factory';
import Client from 'App/Models/Client';
import User from 'App/Models/User';
import { faker, fakerPT_BR } from '@faker-js/faker';
import * as fakerBr from 'faker-br';
import { DateTime } from 'luxon';
import Address from 'App/Models/Address';
import Phone from 'App/Models/Phone';

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

export const AddressFactory = Factory.define(Address, () => {
  return {
    address: fakerPT_BR.location.street(),
    number: fakerPT_BR.location.buildingNumber(),
    complement: fakerPT_BR.location.secondaryAddress(),
    neighborhood: fakerPT_BR.location.county(),
    zipCode: fakerPT_BR.location.zipCode(),
    city: fakerPT_BR.location.city(),
    state: fakerPT_BR.location.state({ abbreviated: true }),
    country: fakerPT_BR.location.country(),
    clientId: 0,
  };
}).build();

export const PhoneFactory = Factory.define(Phone, () => {
  return {
    phoneNumber: fakerPT_BR.phone.number(),
    clientId: 0,
  };
}).build();

export const clientBuilder = async (qty: number) => {
  const clients = await ClientFactory.createMany(qty);
  const clientIds = clients.map((client) => client.id);

  const addresses = await Promise.all(
    clientIds.map(async (id) => {
      const address = await AddressFactory.create();
      address.clientId = id;
      await address.save();
      return address;
    }),
  );

  const phones = await Promise.all(
    clientIds.map(async (id) => {
      const phone = await PhoneFactory.create();
      phone.clientId = id;
      await phone.save();
      return phone;
    }),
  );

  if (qty === 1)
    return { client: clients[0], address: addresses[0], phone: phones[0] };
  return { clients, addresses, phones };
};
