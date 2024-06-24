import { Sex } from '@faker-js/faker';
import Database from '@ioc:Adonis/Lucid/Database';
import { ClientFactory } from 'Database/factories';
import test from 'japa';
import supertest from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;
const BASE_PAYLOAD = {
  name: 'André Resende',
  cpf: '84247616005',
  sex: 'Masculino',
  birthdate: '1995-01-09',
};

test.group('Clients', async (group) => {
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
    assert.equal(body.client.birthdate, BASE_PAYLOAD.birthdate);
  });

  test('it should return 409 when provide the same CPF twice', async (assert) => {
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
    const clientPayload = { ...BASE_PAYLOAD, birthdate: '09-01-1995' }; //Correto: 1995-01-09
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

  test('it should show all registered clients, ordered by id and only main data', async (assert) => {
    const numberOfClients = 10;
    const clients = await ClientFactory.createMany(numberOfClients);
    const { body } = await supertest(BASE_URL)
      .get('/clients/index')
      .expect(200);

    assert.equal(body.clients.length, clients.length);

    // id, name e cpf considerados os principais
    clients.forEach((client, i) => {
      assert.equal(body.clients[i].id, client.id);
      assert.equal(body.clients[i].name, client.name);
      assert.equal(body.clients[i].cpf, client.cpf);
      assert.notExists(body.clients[i].sex);
      assert.notExists(body.clients[i].birthdate);
    });
  });

  // Apenas o CPF não pode ser alterado
  test('it should update an client', async (assert) => {
    const { id } = await ClientFactory.create();
    const { body } = await supertest(BASE_URL)
      .put(`/clients/update/${id}`)
      .send({
        name: BASE_PAYLOAD.name,
        sex: BASE_PAYLOAD.sex,
        birthdate: BASE_PAYLOAD.birthdate,
      })
      .expect(200);

    assert.exists(body.client, 'Client undefined');
    assert.equal(body.client.name, BASE_PAYLOAD.name);
    assert.equal(body.client.sex, BASE_PAYLOAD.sex);
    assert.equal(body.client.birthdate, BASE_PAYLOAD.birthdate);
  });

  test('it should return 422 when required data is not provided', async (assert) => {
    const { id } = await ClientFactory.create();

    const { body } = await supertest(BASE_URL)
      .put(`/clients/update/${id}`)
      .send({})
      .expect(422);

    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
    assert.include(body.message, 'no data provided');
  });

  test('it should return 403 when trying to update cpf', async (assert) => {
    const client = await ClientFactory.create();

    const { body } = await supertest(BASE_URL)
      .put(`/clients/update/${client.id}`)
      .send({ ...BASE_PAYLOAD, cpf: '11111111111' })
      .expect(403);

    assert.equal(body.status, 403);
    assert.equal(body.code, 'FORBIDDEN');
    assert.equal(body.message, 'cpf cannot be updated');

    await client.refresh();
    assert.notEqual(client.cpf, '11111111111');
  });

  test('it should return 422 when provided an invalid name', async (assert) => {
    const { id } = await ClientFactory.create();
    const clientPayload = {
      name: 'A',
    };
    const { body } = await supertest(BASE_URL)
      .put(`/clients/update/${id}`)
      .send(clientPayload)
      .expect(422);

    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should return 422 when provided an invalid sex', async (assert) => {
    const { id } = await ClientFactory.create();
    const clientPayload = {
      sex: 'abc',
    };
    const { body } = await supertest(BASE_URL)
      .put(`/clients/update/${id}`)
      .send(clientPayload)
      .expect(422);

    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should return 422 when provided an invalid birthdate', async (assert) => {
    const { id } = await ClientFactory.create();
    const clientPayload = {
      birthdate: '09-01-1995',
    };
    const { body } = await supertest(BASE_URL)
      .put(`/clients/update/${id}`)
      .send(clientPayload)
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
