import test from 'japa';
import Purchase from 'App/Models/Purchase';
import supertest from 'supertest';
import Database from '@ioc:Adonis/Lucid/Database';
import { factoryBuilder } from 'Database/factories';
import dataTimeFormatter from '../../utils/timeFormatter';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;
const BASE_PAYLOAD = {
  quantity: 2,
  unitPrice: 299.99,
  totalPrice: 599.98,
  date: '2024-06-25',
  time: '14:30:00',
  clientId: 1,
  productId: 1,
};

test.group('Purchases', (group) => {
  test('it should create a purchase', async (assert) => {
    await factoryBuilder(1);
    const { body } = await supertest(BASE_URL)
      .post('/purchases')
      .send(BASE_PAYLOAD)
      .expect(201);
    const dateTime = dataTimeFormatter(BASE_PAYLOAD.time);
    assert.deepEqual(
      Object.values(body).slice(0, -1),
      Object.values({ ...BASE_PAYLOAD, time: dateTime }),
    );
  });

  test('it should return 422 when required data is not provided', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/purchases')
      .send({})
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should show all registered purchases, ordered by id', async (assert) => {
    const numberOfClients = 10;
    const { purchases } = await factoryBuilder(numberOfClients);
    const { body } = await supertest(BASE_URL).get('/purchases').expect(200);
    purchases?.forEach((purchase, i) => {
      const { id, total_price, date, client_id, product_id } =
        body.purchases[i];
      const {
        id: _id,
        totalPrice: _total_price,
        date: _date,
        clientId: _client_id,
        productId: _product_id,
      } = purchase;
      assert.equal(id, _id);
      assert.equal(total_price, _total_price);
      assert.equal(date, _date.toFormat('yyyy-MM-dd'));
      assert.equal(client_id, _client_id);
      assert.equal(product_id, _product_id);
    });
  });

  test('it should show a single purchase', async (assert) => {
    const { purchase } = await factoryBuilder(1);
    const { body } = await supertest(BASE_URL)
      .get(`/purchases/${purchase?.id}`)
      .expect(200);
    assert.equal(body.purchase[0].id, purchase!.id);
    assert.equal(body.purchase[0].quantity, purchase!.quantity);
    assert.equal(body.purchase[0].unit_price, purchase!.unitPrice);
    assert.equal(body.purchase[0].total_price, purchase!.totalPrice);
    assert.equal(body.purchase[0].date, purchase!.date.toFormat('yyyy-MM-dd'));
    assert.equal(body.purchase[0].client_id, purchase!.clientId);
    assert.equal(body.purchase[0].product_id, purchase!.productId);
  });

  test('it should update a purchase', async (assert) => {
    const { purchase } = await factoryBuilder(1);
    const { body } = await supertest(BASE_URL)
      .put(`/purchases/${purchase!.id}`)
      .send(BASE_PAYLOAD)
      .expect(200);
    await purchase?.refresh();
    assert.deepEqual(purchase?.serialize(), body.purchase);
  });

  test('it should return 422 when required data is not provided', async (assert) => {
    const { purchase } = await factoryBuilder(1);

    const { body } = await supertest(BASE_URL)
      .put(`/purchases/${purchase?.id}`)
      .send({})
      .expect(422);

    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
    assert.include(body.message, 'no data provided');
  });

  test('it should delete a client and return 200', async (assert) => {
    const { purchase } = await factoryBuilder(1);
    const { body } = await supertest(BASE_URL)
      .delete(`/purchases/${purchase?.id}`)
      .expect(200);
    const searchDeletedPurchase = await Purchase.findBy('id', purchase?.id);
    assert.equal(body.message, 'Purchase deleted successfully');
    assert.exists(searchDeletedPurchase?.deletedAt);
  });

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction();
  });
  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction();
  });
});
