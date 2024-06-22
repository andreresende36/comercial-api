import Database from '@ioc:Adonis/Lucid/Database';
import { UserFactory } from 'Database/factories';
import test from 'japa';
import supertest from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group('User', (group) => {
  test('it should create an user', async (assert) => {
    const userPayload = {
      email: 'teste@teste.com',
      username: 'user',
      password: '123456',
      avatar: 'https://images.com/image/100',
    };
    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send(userPayload)
      .expect(201);

    assert.exists(body.user, 'User undefined');
    assert.exists(body.user.id, 'Id undefined');
    assert.equal(body.user.email, userPayload.email);
    assert.equal(body.user.username, userPayload.username);
    assert.notExists(body.user.password, 'Password defined');
    assert.equal(body.user.avatar, userPayload.avatar);
  });

  test('it should return 409 email is already in use', async (assert) => {
    const { email } = await UserFactory.create();
    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        email,
        username: 'user',
        password: '123456',
      })
      .expect(409);

    assert.include(body.message, 'email');
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 409);
  });
  test('it should return 409 username is already in use', async (assert) => {
    const { username } = await UserFactory.create();
    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        username,
        email: 'teste@teste.com',
        password: '123456',
      })
      .expect(409);

    assert.include(body.message, 'username');
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 409);
  });

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction();
  });
  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction();
  });
});
