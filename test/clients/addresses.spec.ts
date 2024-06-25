import Database from '@ioc:Adonis/Lucid/Database';
import { clientBuilder } from 'Database/factories';
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

test.group('Addresses', (group) => {
  test('it should create an address', async (assert) => {
    const { client } = await clientBuilder(1);
    const { body } = await supertest(BASE_URL)
      .post(`/clients/${client?.id}/addresses`)
      .send(BASE_PAYLOAD)
      .expect(201);
    await client?.load('addresses');
    assert.exists(client?.addresses[1]);
    assert.exists(client?.addresses[1].id);
    assert.equal(body.address.address, BASE_PAYLOAD.address);
    assert.equal(body.address.number, BASE_PAYLOAD.number);
    assert.equal(body.address.complement, BASE_PAYLOAD.complement);
    assert.equal(body.address.neighborhood, BASE_PAYLOAD.neighborhood);
    assert.equal(body.address.zip_code, BASE_PAYLOAD.zipCode);
    assert.equal(body.address.city, BASE_PAYLOAD.city);
    assert.equal(body.address.state, BASE_PAYLOAD.state);
    assert.equal(body.address.country, BASE_PAYLOAD.country);
  });

  test('it should return 422 when required data is not provided', async (assert) => {
    const { client } = await clientBuilder(1);
    const { body } = await supertest(BASE_URL)
      .post(`/clients/${client?.id}/addresses`)
      .send({})
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should return 422 when providing an invalid zipcode', async (assert) => {
    const { client } = await clientBuilder(1);
    const addressPayload = { ...BASE_PAYLOAD };
    addressPayload.zipCode = '123';
    const { body } = await supertest(BASE_URL)
      .post(`/clients/${client?.id}/addresses`)
      .send(addressPayload)
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should return 422 when providing an invalid state', async (assert) => {
    const { client } = await clientBuilder(1);
    const addressPayload = { ...BASE_PAYLOAD };
    addressPayload.state = 'ABC1';
    const { body } = await supertest(BASE_URL)
      .post(`/clients/${client?.id}/addresses`)
      .send(addressPayload)
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction();
  });
  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction();
  });
});
