import Database from '@ioc:Adonis/Lucid/Database';
import Phone from 'App/Models/Phone';
import User from 'App/Models/User';
import { PhoneFactory, ClientFactory, UserFactory } from 'Database/factories';
import test from 'japa';
import supertest from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;
const BASE_PAYLOAD = {
  phoneNumber: '5562999999999',
};
let token = '';

test.group('Phones', (group) => {
  test('it should create an phone number', async (assert) => {
    const client = await ClientFactory.create();
    const { body } = await supertest(BASE_URL)
      .post(`/clients/${client?.id}/phones`)
      .set('Authorization', `Bearer ${token}`)
      .send(BASE_PAYLOAD)
      .expect(201);
    await client?.load('phones');
    assert.exists(client?.phones[0]);
    assert.exists(client?.phones[0].id);
    assert.deepEqual(
      Object.values(body.phone).slice(0, -2),
      Object.values(BASE_PAYLOAD),
    );
  });

  test('it should return 422 when required data is not provided', async (assert) => {
    const client = await ClientFactory.create();
    const { body } = await supertest(BASE_URL)
      .post(`/clients/${client?.id}/phones`)
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should return 422 when providing an invalid phone number', async (assert) => {
    const client = await ClientFactory.create();
    const { body } = await supertest(BASE_URL)
      .post(`/clients/${client?.id}/phones`)
      .set('Authorization', `Bearer ${token}`)
      .send({ phoneNumber: '123' })
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should show all registered phone numbers, ordered by id', async (assert) => {
    const client = await ClientFactory.create();
    for (let index = 0; index < 5; index++) {
      const phone = await PhoneFactory.make();
      await phone.related('client').associate(client);
      await phone.save();
    }
    const { body } = await supertest(BASE_URL)
      .get(`/clients/${client?.id}/phones`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    await client?.load('phones');

    assert.equal(body.phones.length, client?.phones.length);
    assert.equal(body.phones.length, 5);
  });

  test('it should update an phone number', async (assert) => {
    const client = await ClientFactory.create();
    const phone = await PhoneFactory.make();
    await phone.related('client').associate(client);
    await phone.save();
    await client?.load('phones');
    const { body } = await supertest(BASE_URL)
      .put(`/clients/phones/${client?.phones[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(BASE_PAYLOAD)
      .expect(200);
    assert.deepEqual(
      Object.values(body.phone).slice(1, -1),
      Object.values(BASE_PAYLOAD),
    );
  });

  test('it should return 422 when required data is not provided', async (assert) => {
    const client = await ClientFactory.create();
    const phone = await PhoneFactory.make();
    await phone.related('client').associate(client);
    await phone.save();
    await client?.load('phones');

    const { body } = await supertest(BASE_URL)
      .put(`/clients/phones/${client?.phones[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.include(body.message, 'no data provided');
  });

  test('it should return 422 when provided an invalid phone number', async (assert) => {
    const client = await ClientFactory.create();
    const phone = await PhoneFactory.make();
    await phone.related('client').associate(client);
    await phone.save();
    await client?.load('phones');

    const { body } = await supertest(BASE_URL)
      .put(`/clients/phones/${client?.phones[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ phoneNumber: '123' })
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
  });

  test('it should delete an phone and return 200', async (assert) => {
    const client = await ClientFactory.create();
    const phone = await PhoneFactory.make();
    await phone.related('client').associate(client);
    await phone.save();
    await client?.load('phones');

    const { body } = await supertest(BASE_URL)
      .delete(`/clients/phones/${client?.phones[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const searchDeletedphone = await Phone.find(client?.phones[0].id);

    assert.equal(body.message, 'Phone deleted successfully');
    assert.notExists(searchDeletedphone);
  });

  test('it should show an phone number with all the attributes', async (assert) => {
    const client = await ClientFactory.create();
    const phone = await PhoneFactory.make();
    await phone.related('client').associate(client);
    await phone.save();
    await client?.load('phones');
    const { body } = await supertest(BASE_URL)
      .get(`/clients/phones/${client?.phones[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    assert.deepEqual(
      Object.values(client!.phones[0].serialize()),
      Object.values(body.phone),
    );
  });

  group.before(async () => {
    const plainPassword = 'test';
    const _user = await UserFactory.merge({
      password: plainPassword,
    }).create();
    const { body } = await supertest(BASE_URL)
      .post('/login')
      .set('Authorization', `Bearer ${token}`)
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
