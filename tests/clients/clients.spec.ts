import Database from '@ioc:Adonis/Lucid/Database';
import {
  PurchaseFactory,
  ClientFactory,
  AddressFactory,
  ProductFactory,
  PhoneFactory,
  ProductCategoryFactory,
  ProductBrandFactory,
  UserFactory,
} from 'Database/factories';
import test from 'japa';
import supertest from 'supertest';
import Client from 'App/Models/Client';
import User from 'App/Models/User';
const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;
const BASE_PAYLOAD = {
  name: 'André Resende',
  cpf: '84247616005',
  sex: 'Masculino',
  birthdate: '1995-01-09',
  address: 'Rua dos Testes',
  number: '123',
  complement: 'Apartamento 110',
  neighborhood: 'Centro',
  zipCode: '74810100',
  city: 'Goiânia',
  state: 'GO',
  country: 'Brasil',
  phoneNumber: '5562999999999',
};

let token = '';

test.group('Clients', async (group) => {
  test('it should create an client', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/clients')
      .set('Authorization', `Bearer ${token}`)
      .send(BASE_PAYLOAD)
      .expect(201);

    assert.exists(body.client, 'Client undefined');
    assert.exists(body.client.id, 'Client Id undefined');
    assert.equal(body.client.name, BASE_PAYLOAD.name);
    assert.equal(body.client.cpf, BASE_PAYLOAD.cpf);
    assert.equal(body.client.sex, BASE_PAYLOAD.sex);
    assert.equal(body.client.birthdate, BASE_PAYLOAD.birthdate);
    assert.equal(body.address.address, BASE_PAYLOAD.address);
    assert.equal(body.address.number, BASE_PAYLOAD.number);
    assert.equal(body.address.complement, BASE_PAYLOAD.complement);
    assert.equal(body.address.neighborhood, BASE_PAYLOAD.neighborhood);
    assert.equal(body.address.zip_code, BASE_PAYLOAD.zipCode);
    assert.equal(body.address.city, BASE_PAYLOAD.city);
    assert.equal(body.address.state, BASE_PAYLOAD.state);
    assert.equal(body.address.country, BASE_PAYLOAD.country);
    assert.equal(body.phone.phone_number, BASE_PAYLOAD.phoneNumber);
  });

  test('it should return 409 when provide the same CPF twice', async (assert) => {
    const client = await ClientFactory.create();

    const clientPayload = { ...BASE_PAYLOAD };
    clientPayload.cpf = client?.cpf!;
    const { body } = await supertest(BASE_URL)
      .post('/clients')
      .set('Authorization', `Bearer ${token}`)
      .send(clientPayload)
      .expect(409);

    assert.include(body.message, 'cpf');
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 409);
  });

  test('it should return 422 when required data is not provided', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should return 422 when providing an invalid name', async (assert) => {
    const clientPayload = { ...BASE_PAYLOAD }; // Mínimo 4 dígitos
    clientPayload.name = 'A';
    const { body } = await supertest(BASE_URL)
      .post('/clients')
      .set('Authorization', `Bearer ${token}`)
      .send(clientPayload)
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should return 422 when providing an invalid cpf', async (assert) => {
    const clientPayload = { ...BASE_PAYLOAD };
    clientPayload.cpf = '11111111111';
    const { body } = await supertest(BASE_URL)
      .post('/clients')
      .set('Authorization', `Bearer ${token}`)
      .send(clientPayload)
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should return 422 when providing an invalid birthdate', async (assert) => {
    const clientPayload = { ...BASE_PAYLOAD };
    clientPayload.birthdate = '09-01-1995'; //Correto: 1995-01-09
    const { body } = await supertest(BASE_URL)
      .post('/clients')
      .set('Authorization', `Bearer ${token}`)
      .send(clientPayload)
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should return 422 when providing an invalid sex', async (assert) => {
    const clientPayload = { ...BASE_PAYLOAD };
    clientPayload.sex = 'abc'; //Masculino, Feminino ou Outros
    const { body } = await supertest(BASE_URL)
      .post('/clients')
      .set('Authorization', `Bearer ${token}`)
      .send(clientPayload)
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should return 422 when providing an invalid zipcode', async (assert) => {
    const clientPayload = { ...BASE_PAYLOAD };
    clientPayload.zipCode = '123';
    const { body } = await supertest(BASE_URL)
      .post('/clients')
      .set('Authorization', `Bearer ${token}`)
      .send(clientPayload)
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should return 422 when providing an invalid state', async (assert) => {
    const clientPayload = { ...BASE_PAYLOAD };
    clientPayload.state = 'ABC1';
    const { body } = await supertest(BASE_URL)
      .post('/clients')
      .set('Authorization', `Bearer ${token}`)
      .send(clientPayload)
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should return 422 when providing an invalid phone number', async (assert) => {
    const clientPayload = { ...BASE_PAYLOAD };
    clientPayload.phoneNumber = '123';
    const { body } = await supertest(BASE_URL)
      .post('/clients')
      .set('Authorization', `Bearer ${token}`)
      .send(clientPayload)
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should show all registered clients, ordered by id and only main data', async (assert) => {
    const numberOfClients = 10;
    const clients = await ClientFactory.createMany(numberOfClients);
    const addresses = await Promise.all(
      clients.map(async (client) => {
        const address = await AddressFactory.make();
        await address.related('client').associate(client);
        await address.save();
        return address;
      }),
    );
    const { body } = await supertest(BASE_URL)
      .get('/clients')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    if (!clients || !addresses) {
      assert.fail('Clients or addresses are undefined');
      return;
    }
    assert.equal(body.clients.length, clients.length);
    clients.forEach((client, i) => {
      assert.equal(body.clients[i].id, client.id);
      assert.equal(body.clients[i].name, client.name);
      assert.equal(body.clients[i].cpf, client.cpf);
      assert.equal(body.clients[i].addresses[0].city, addresses[i].city);
      assert.equal(body.clients[i].addresses[0].state, addresses[i].state);
      assert.notExists(body.clients[i].sex);
      assert.notExists(body.clients[i].birthdate);
      assert.notExists(body.clients[i].addresses[0].address);
      assert.notExists(body.clients[i].addresses[0].number);
      assert.notExists(body.clients[i].addresses[0].complement);
      assert.notExists(body.clients[i].addresses[0].neighborhood);
      assert.notExists(body.clients[i].addresses[0].zipCode);
      assert.notExists(body.clients[i].addresses[0].country);
      assert.notExists(body.clients[i].addresses[0].clientId);
      assert.notExists(body.clients[i].phones);
    });
  });

  // Apenas o CPF não pode ser alterado
  test('it should update an client', async (assert) => {
    const client = await ClientFactory.create();
    const {
      name,
      sex,
      birthdate,
      address,
      number,
      complement,
      neighborhood,
      city,
      country,
      phoneNumber,
      state,
      zipCode,
    } = BASE_PAYLOAD;
    const { body } = await supertest(BASE_URL)
      .put(`/clients/${client?.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name,
        sex,
        birthdate,
        address,
        number,
        complement,
        neighborhood,
        city,
        country,
        phoneNumber,
        state,
        zipCode,
      })
      .expect(200);

    await client?.refresh();
    await client?.load('addresses');
    await client?.load('phones');
    assert.exists(body.client, 'Client undefined');
    assert.equal(client?.cpf, client?.cpf);
    assert.equal(client?.name, name);
    assert.equal(client?.sex, sex);
    assert.equal(client?.birthdate.toFormat('yyyy-MM-dd'), birthdate);
    assert.equal(client?.addresses[0].address, address);
    assert.equal(client?.addresses[0].number, number);
    assert.equal(client?.addresses[0].complement, complement);
    assert.equal(client?.addresses[0].neighborhood, neighborhood);
    assert.equal(client?.addresses[0].city, city);
    assert.equal(client?.addresses[0].country, country);
    assert.equal(client?.addresses[0].state, state);
    assert.equal(client?.addresses[0].zipCode, zipCode);
    assert.equal(client?.phones[0].phoneNumber, phoneNumber);
  });

  test('it should return 422 when required data is not provided', async (assert) => {
    const client = await ClientFactory.create();

    const { body } = await supertest(BASE_URL)
      .put(`/clients/${client?.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(422);

    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
    assert.include(body.message, 'no data provided');
  });

  test('it should return 403 when trying to update with a valid cpf', async (assert) => {
    const client = await ClientFactory.create();
    const clientPayload = { ...BASE_PAYLOAD };

    const { body } = await supertest(BASE_URL)
      .put(`/clients/${client?.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(clientPayload)
      .expect(403);

    assert.equal(body.status, 403);
    assert.equal(body.code, 'FORBIDDEN');
    assert.equal(body.message, 'cpf cannot be updated');

    await client?.refresh();
    assert.notEqual(client?.cpf, clientPayload.cpf);
  });

  test('it should return 422 when provided an invalid name', async (assert) => {
    const client = await ClientFactory.create();
    const clientPayload = {
      name: 'A',
    };
    const { body } = await supertest(BASE_URL)
      .put(`/clients/${client?.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(clientPayload)
      .expect(422);

    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
    assert.notEqual(client?.name, clientPayload.name);
  });

  test('it should return 422 when provided an invalid sex', async (assert) => {
    const client = await ClientFactory.create();
    const clientPayload = {
      sex: 'abc',
    };
    const { body } = await supertest(BASE_URL)
      .put(`/clients/${client?.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(clientPayload)
      .expect(422);

    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
    assert.notEqual(client?.sex, clientPayload.sex);
  });

  test('it should return 422 when provided an invalid birthdate', async (assert) => {
    const client = await ClientFactory.create();
    const clientPayload = {
      birthdate: '09-01-1995',
    };
    const { body } = await supertest(BASE_URL)
      .put(`/clients/${client?.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(clientPayload)
      .expect(422);

    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
    assert.notEqual(
      client?.birthdate.toFormat('yyyy-MM-dd'),
      clientPayload.birthdate,
    );
  });
  test('it should return 422 when provided an invalid state', async (assert) => {
    const client = await ClientFactory.create();
    const address = await AddressFactory.make();
    await address.related('client').associate(client);
    const clientPayload = {
      state: 'ABC1',
    };
    const { body } = await supertest(BASE_URL)
      .put(`/clients/${client?.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(clientPayload)
      .expect(422);
    await client?.load('addresses');
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
    assert.notEqual(client?.addresses[0].state, clientPayload.state);
  });
  test('it should return 422 when provided an invalid zipcode', async (assert) => {
    const client = await ClientFactory.create();
    const address = await AddressFactory.make();
    await address.related('client').associate(client);
    const clientPayload = {
      zipCode: '123',
    };
    const { body } = await supertest(BASE_URL)
      .put(`/clients/${client?.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(clientPayload)
      .expect(422);
    await client?.load('addresses');
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
    assert.notEqual(client?.addresses[0].zipCode, clientPayload.zipCode);
  });
  test('it should return 422 when provided an invalid phone number', async (assert) => {
    const client = await ClientFactory.create();
    const phone = await PhoneFactory.make();
    await phone.related('client').associate(client);
    const clientPayload = {
      phoneNumber: '123',
    };
    const { body } = await supertest(BASE_URL)
      .put(`/clients/${client?.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(clientPayload)
      .expect(422);

    await client?.load('phones');
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
    assert.notEqual(client?.phones[0].phoneNumber, clientPayload.phoneNumber);
  });

  test('it should show a single client and return 200, with his purchases ordered by date, first dates first', async (assert) => {
    const client = await ClientFactory.create();
    const category = await ProductCategoryFactory.create();
    const brand = await ProductBrandFactory.create();
    const product = await ProductFactory.make();
    await product.related('category').associate(category);
    await product.related('brand').associate(brand);
    await product.save();
    for (let index = 0; index < 5; index++) {
      const purchase = await PurchaseFactory.make();
      await purchase.related('client').associate(client);
      await purchase.related('product').associate(product);
      await purchase.save();
    }
    await client?.load('purchases');

    const { body } = await supertest(BASE_URL)
      .get(`/clients/${client?.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const sortedPurchases = client?.purchases.sort((a, b) => {
      const dateA = a.date.toMillis();
      const dateB = b.date.toMillis();
      return dateB - dateA;
    });

    assert.equal(body.client.purchases.length, 5);
    sortedPurchases?.forEach((purchase, i) => {
      delete body.client.purchases[i].product;
      assert.deepEqual(purchase.serialize(), body.client.purchases[i]);
    });
  });

  test('it should delete a client and return 200', async (assert) => {
    const client = await ClientFactory.create();

    const { body } = await supertest(BASE_URL)
      .delete(`/clients/${client?.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const searchDeletedClient = await Client.findBy('id', client?.id);

    assert.equal(body.message, 'Client deleted successfully');
    assert.notExists(searchDeletedClient);
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
