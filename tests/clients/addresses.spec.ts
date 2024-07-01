import Database from '@ioc:Adonis/Lucid/Database';
import Address from 'App/Models/Address';
import User from 'App/Models/User';
import { AddressFactory, ClientFactory, UserFactory } from 'Database/factories';
import test from 'japa';
import supertest from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;
const BASE_PAYLOAD = {
  address: 'Rua dos Testes',
  number: '123',
  complement: 'Apartamento 110',
  neighborhood: 'Centro',
  zipCode: '74810100',
  city: 'Goiânia',
  state: 'GO',
  country: 'Brasil',
};

let token = '';

test.group('Addresses', (group) => {
  test('it should create an address', async (assert) => {
    const client = await ClientFactory.create();
    const { body } = await supertest(BASE_URL)
      .post(`/clients/${client?.id}/addresses`)
      .set('Authorization', `Bearer ${token}`)
      .send(BASE_PAYLOAD)
      .expect(201);
    await client?.load('addresses');
    assert.exists(client?.addresses[0]);
    assert.exists(client?.addresses[0].id);
    assert.deepEqual(
      Object.values(body.address).slice(0, -2),
      Object.values(BASE_PAYLOAD),
    );
  });

  test('it should return 422 when required data is not provided', async (assert) => {
    const client = await ClientFactory.create();
    const { body } = await supertest(BASE_URL)
      .post(`/clients/${client?.id}/addresses`)
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should return 422 when providing an invalid zipcode', async (assert) => {
    const client = await ClientFactory.create();
    const addressPayload = { ...BASE_PAYLOAD };
    addressPayload.zipCode = '123';
    const { body } = await supertest(BASE_URL)
      .post(`/clients/${client?.id}/addresses`)
      .set('Authorization', `Bearer ${token}`)
      .send(addressPayload)
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should return 422 when providing an invalid state', async (assert) => {
    const client = await ClientFactory.create();
    const addressPayload = { ...BASE_PAYLOAD };
    addressPayload.state = 'ABC1';
    const { body } = await supertest(BASE_URL)
      .post(`/clients/${client?.id}/addresses`)
      .set('Authorization', `Bearer ${token}`)
      .send(addressPayload)
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should show all registered addresses, ordered by id', async (assert) => {
    const client = await ClientFactory.create();
    for (let index = 0; index < 5; index++) {
      const address = await AddressFactory.make();
      await address.related('client').associate(client);
      await address.save();
    }
    const { body } = await supertest(BASE_URL)
      .get(`/clients/${client?.id}/addresses`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    await client?.load('addresses');
    assert.equal(body.addresses.length, client?.addresses.length);
    assert.equal(body.addresses.length, 5);
  });

  test('it should update an address', async (assert) => {
    const client = await ClientFactory.create();
    const address = await AddressFactory.make();
    await address.related('client').associate(client);
    await client?.load('addresses');
    const { body } = await supertest(BASE_URL)
      .put(`/clients/addresses/${address.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(BASE_PAYLOAD)
      .expect(200);
    assert.deepEqual(
      Object.values(body.address).slice(1, -1),
      Object.values(BASE_PAYLOAD),
    );
  });
  test('it should return 422 when required data is not provided', async (assert) => {
    const client = await ClientFactory.create();
    const address = await AddressFactory.make();
    await address.related('client').associate(client);
    await client?.load('addresses');

    const { body } = await supertest(BASE_URL)
      .put(`/clients/addresses/${address.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.include(body.message, 'no data provided');
  });

  test('it should return 422 when provided an invalid zipcode', async (assert) => {
    const client = await ClientFactory.create();
    const address = await AddressFactory.make();
    await address.related('client').associate(client);
    await client?.load('addresses');

    const { body } = await supertest(BASE_URL)
      .put(`/clients/addresses/${client?.addresses[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ zipCode: '123' })
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
  });

  test('it should return 422 when provided an invalid state', async (assert) => {
    const client = await ClientFactory.create();
    const address = await AddressFactory.make();
    await address.related('client').associate(client);
    await client?.load('addresses');

    const { body } = await supertest(BASE_URL)
      .put(`/clients/addresses/${client?.addresses[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ state: 'ABC1' })
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
  });

  test('it should delete an address and return 200', async (assert) => {
    const client = await ClientFactory.create();
    const address = await AddressFactory.make();
    await address.related('client').associate(client);
    await client?.load('addresses');

    const { body } = await supertest(BASE_URL)
      .delete(`/clients/addresses/${client?.addresses[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const searchDeletedAddress = await Address.find(client?.addresses[0].id);

    assert.equal(body.message, 'Address deleted successfully');
    assert.notExists(searchDeletedAddress);
  });

  test('it should show an address with all the attributes', async (assert) => {
    const client = await ClientFactory.create();
    const address = await AddressFactory.make();
    await address.related('client').associate(client);
    await client?.load('addresses');
    const { body } = await supertest(BASE_URL)
      .get(`/clients/addresses/${client?.addresses[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    assert.deepEqual(
      Object.values(client!.addresses[0].serialize()),
      Object.values(body.address),
    );
  });

  group.before(async () => {
    const plainPassword = 'test';
    const _user = await UserFactory.merge({
      password: plainPassword,
    }).create();
    const { body } = await supertest(BASE_URL)
      .post('/login')
      .send({ email: _user.email, password: plainPassword })
      .expect(201);
    token = body.token.token;
  });

  group.after(async () => {
    await User.truncate(true);
  });

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction();
  });
  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction();
  });
});
