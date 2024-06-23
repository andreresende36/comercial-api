import Database from '@ioc:Adonis/Lucid/Database';
import test from 'japa';
import { UserFactory } from 'Database/factories';
import supertest from 'supertest';
import Mail from '@ioc:Adonis/Addons/Mail';
import Hash from '@ioc:Adonis/Core/Hash';
import { DateTime, Duration } from 'luxon';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group('Password', async (group) => {
  test('it should send email with forgot password instructions', async (assert) => {
    const { email, username } = await UserFactory.create();
    const subject = 'Recuperação de senha';
    const from = 'no-reply@ecommerce.com';

    Mail.trap((message) => {
      assert.equal(message.subject, subject);
      assert.deepEqual(message.from, { address: from });
      assert.deepEqual(message.to, [{ address: email }]);
      assert.include(message.html!, username);
    });

    await supertest(BASE_URL)
      .post('/forgot-password')
      .send({
        email,
        resetPasswordUrl: 'http://url.com',
      })
      .expect(204);
  });

  test('it should create a reset password token', async (assert) => {
    const user = await UserFactory.create();
    await supertest(BASE_URL)
      .post('/forgot-password')
      .send({
        email: user.email,
        resetPasswordUrl: 'http://url.com',
      })
      .expect(204);
    const tokens = await user.related('tokens').query();
    assert.isNotEmpty(tokens);
  });

  test('it should return 422 when required data to generate token is not provided or invalid', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/forgot-password')
      .send({})
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should be able to reset password', async (assert) => {
    const user = await UserFactory.create();
    const { token } = await user.related('tokens').create({ token: 'abc123' });

    await supertest(BASE_URL)
      .post('/reset-password')
      .send({ token, password: '123456' })
      .expect(204);

    await user.refresh();
    assert.isTrue(await Hash.verify(user.password, '123456'));
  });

  test('it should return 422 when required data to reset is not provided or invalid', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/reset-password')
      .send({})
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should return 404 when using the same token twice', async (assert) => {
    const user = await UserFactory.create();
    const { token } = await user.related('tokens').create({ token: 'abc123' });

    await supertest(BASE_URL)
      .post('/reset-password')
      .send({ token, password: '123456' });

    const { body } = await supertest(BASE_URL)
      .post('/reset-password')
      .send({ token, password: '123456' })
      .expect(404);

    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 404);
  });

  test('it cannot reset password when token is expired after 2 hours', async (assert) => {
    const user = await UserFactory.create();
    const date = DateTime.now().minus(Duration.fromISOTime('02:01'));
    const { token } = await user
      .related('tokens')
      .create({ token: 'abc123', createdAt: date });

    const { body } = await supertest(BASE_URL)
      .post('/reset-password')
      .send({ token, password: '123456' })
      .expect(410);

    assert.equal(body.code, 'TOKEN_EXPIRED');
    assert.equal(body.status, 410);
    assert.equal(body.message, 'token has expired');
  });

  group.beforeEach(async () => {
    Mail.trap((_message) => {});
    await Database.beginGlobalTransaction();
  });
  group.afterEach(async () => {
    Mail.restore();
    await Database.rollbackGlobalTransaction();
  });
});
