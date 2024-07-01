import test from 'japa';
import Purchase from 'App/Models/Purchase';
import supertest from 'supertest';
import Database from '@ioc:Adonis/Lucid/Database';
import {
  ClientFactory,
  ProductBrandFactory,
  ProductCategoryFactory,
  ProductFactory,
  PurchaseFactory,
  UserFactory,
} from 'Database/factories';
import dataTimeFormatter from '../../utils/timeFormatter';
import Client from 'App/Models/Client';
import ProductCategory from 'App/Models/ProductCategory';
import Product from 'App/Models/Product';
import ProductBrand from 'App/Models/ProductBrand';
import User from 'App/Models/User';

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
let token = '';
test.group('Purchases', (group) => {
  test('it should create a purchase', async (assert) => {
    await ClientFactory.create();
    await ProductCategoryFactory.create();
    await ProductBrandFactory.create();
    await ProductFactory.create();
    const { body } = await supertest(BASE_URL)
      .post('/purchases')
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should show all registered purchases, ordered by id', async (assert) => {
    await ClientFactory.create();
    await ProductCategoryFactory.create();
    await ProductBrandFactory.create();
    await ProductFactory.create();

    const purchases = await PurchaseFactory.createMany(10);
    const { body } = await supertest(BASE_URL)
      .get('/purchases')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
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
      assert.equal(total_price, parseFloat(_total_price.toFixed(2)));
      assert.equal(date, _date.toFormat('yyyy-MM-dd'));
      assert.equal(client_id, _client_id);
      assert.equal(product_id, _product_id);
    });
  });

  test('it should show a single purchase', async (assert) => {
    await ClientFactory.create();
    await ProductCategoryFactory.create();
    await ProductBrandFactory.create();
    await ProductFactory.create();
    const purchase = await PurchaseFactory.create();
    const { body } = await supertest(BASE_URL)
      .get(`/purchases/${purchase?.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    assert.equal(body.purchase[0].id, purchase!.id);
    assert.equal(body.purchase[0].quantity, purchase!.quantity);
    assert.equal(body.purchase[0].unit_price, purchase!.unitPrice);
    assert.equal(
      body.purchase[0].total_price,
      parseFloat(purchase!.totalPrice.toFixed(2)),
    );
    assert.equal(body.purchase[0].date, purchase!.date.toFormat('yyyy-MM-dd'));
    assert.equal(body.purchase[0].client_id, purchase!.clientId);
    assert.equal(body.purchase[0].product_id, purchase!.productId);
  });

  test('it should update a purchase', async (assert) => {
    await ClientFactory.create();
    await ProductCategoryFactory.create();
    await ProductBrandFactory.create();
    await ProductFactory.create();
    const purchase = await PurchaseFactory.create();
    const { body } = await supertest(BASE_URL)
      .put(`/purchases/${purchase!.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(BASE_PAYLOAD)
      .expect(200);
    await purchase?.refresh();
    assert.deepEqual(purchase?.serialize(), body.purchase);
  });

  test('it should return 422 when required data is not provided', async (assert) => {
    await ClientFactory.create();
    await ProductCategoryFactory.create();
    await ProductBrandFactory.create();
    await ProductFactory.create();
    const purchase = await PurchaseFactory.create();
    const { body } = await supertest(BASE_URL)
      .put(`/purchases/${purchase?.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(422);

    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
    assert.include(body.message, 'no data provided');
  });

  test('it should delete a client and return 200', async (assert) => {
    await ClientFactory.create();
    await ProductCategoryFactory.create();
    await ProductBrandFactory.create();
    await ProductFactory.create();
    const purchase = await PurchaseFactory.create();
    const { body } = await supertest(BASE_URL)
      .delete(`/purchases/${purchase?.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const searchDeletedPurchase = await Purchase.findBy('id', purchase?.id);
    assert.equal(body.message, 'Purchase deleted successfully');
    assert.exists(searchDeletedPurchase?.deletedAt);
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
    await Client.truncate(true);
    await ProductBrand.truncate(true);
    await ProductCategory.truncate(true);
    await Product.truncate(true);
    await Purchase.truncate(true);
  });
  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction();
    await Client.truncate(true);
    await ProductBrand.truncate(true);
    await ProductCategory.truncate(true);
    await Product.truncate(true);
    await Purchase.truncate(true);
  });
});
