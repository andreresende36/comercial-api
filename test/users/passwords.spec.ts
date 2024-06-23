import Database from '@ioc:Adonis/Lucid/Database';
import test from 'japa';
import { UserFactory } from 'Database/factories';
import supertest from 'supertest';
import Mail from '@ioc:Adonis/Addons/Mail';

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
        resetPasswordUrl: 'url',
      })
      .expect(204);
  });

  Mail.restore();

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction();
  });
  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction();
  });
});
