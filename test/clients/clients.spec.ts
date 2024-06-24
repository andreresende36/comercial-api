import { DateTime } from 'luxon';
import Database from '@ioc:Adonis/Lucid/Database';
import { ClientFactory } from 'Database/factories';
import test from 'japa';
import supertest from 'supertest';
import Client from 'App/Models/Client';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;
const BASE_PAYLOAD = {
  name: 'André Resende',
  cpf: '84247616005',
  sex: 'Masculino',
  birthDate: '1995-01-09',
};

test.group('clients', async (group) => {
  test('it should create an user', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/clients/store')
      .send(BASE_PAYLOAD)
      .expect(201);
    assert.exists(body.client, 'Client undefined');
    assert.exists(body.client.id, 'Client Id undefined');
    assert.equal(body.client.name, BASE_PAYLOAD.name);
    assert.equal(body.client.cpf, BASE_PAYLOAD.cpf);
    assert.equal(body.client.sex, BASE_PAYLOAD.sex);
    assert.equal(body.client.birth_date, BASE_PAYLOAD.birthDate);
  });

  test('it should return 422 when provide the same CPF twice', async (assert) => {
    const { cpf } = await ClientFactory.create();
    const clientPayload = { ...BASE_PAYLOAD, cpf };
    const { body } = await supertest(BASE_URL)
      .post('/clients/store')
      .send(clientPayload)
      .expect(409);

    assert.include(body.message, 'cpf');
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 409);
  });

  test('it should return 422 when required data is not provided', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/clients/store')
      .send({})
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should return 422 when providing an invalid name', async (assert) => {
    const clientPayload = { ...BASE_PAYLOAD, name: 'A' }; // Mínimo 4 dígitos

    const { body } = await supertest(BASE_URL)
      .post('/clients/store')
      .send(clientPayload)
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should return 422 when providing an invalid cpf', async (assert) => {
    const clientPayload = { ...BASE_PAYLOAD, cpf: '11111111111' };
    const { body } = await supertest(BASE_URL)
      .post('/clients/store')
      .send(clientPayload)
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should return 422 when providing an invalid birthdate', async (assert) => {
    const clientPayload = { ...BASE_PAYLOAD, birthDate: '09-01-1995' }; //Correto: 1995-01-09
    const { body } = await supertest(BASE_URL)
      .post('/clients/store')
      .send(clientPayload)
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should return 422 when providing an invalid sex', async (assert) => {
    const clientPayload = { ...BASE_PAYLOAD, sex: 'abc' }; //Masculino, Feminino ou Outros
    const { body } = await supertest(BASE_URL)
      .post('/clients/store')
      .send(clientPayload)
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should show all registered clients', async (assert) => {
    const numberOfClients = 10;
    const clients = await ClientFactory.createMany(numberOfClients);
    const { body } = await supertest(BASE_URL)
      .get('/clients/index')
      .expect(200);

    const sortedClients = body.clients.sort(
      (a: { id: number }, b: { id: number }) => a.id - b.id,
    );

    assert.equal(body.clients.length, clients.length);
    clients.forEach((client, i) => {
      assert.equal(sortedClients[i].id, client.id);
      assert.equal(sortedClients[i].name, client.name);
      assert.equal(sortedClients[i].cpf, client.cpf);
      assert.equal(sortedClients[i].sex, client.sex);
      assert.equal(
        sortedClients[i].birth_date,
        client.birthDate.toFormat('yyyy-MM-dd'),
      );
    });
  });

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction();
  });
  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction();
  });
});
