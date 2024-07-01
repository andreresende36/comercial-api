import Database from '@ioc:Adonis/Lucid/Database';
import ProductBrand from 'App/Models/ProductBrand';
import User from 'App/Models/User';
import { ProductBrandFactory, UserFactory } from 'Database/factories';
import test from 'japa';
import supertest from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;
const BASE_PAYLOAD = {
  brandName: 'Adidas',
};

let token = '';

test.group('Product brands', (group) => {
  test('it should create a product brand', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post(`/products/brands`)
      .set('Authorization', `Bearer ${token}`)
      .send(BASE_PAYLOAD)
      .expect(201);
    assert.exists(body);
    assert.exists(body.brand.id);
    assert.equal(body.brand.brand_name, BASE_PAYLOAD.brandName);
  });

  test('it should return 422 when required data is not provided', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post(`/products/brands`)
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should show all registered brands, ordered by id', async (assert) => {
    const brands = await ProductBrandFactory.createMany(5);
    const { body } = await supertest(BASE_URL)
      .get('/products/brands')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    assert.equal(body.brands.length, brands?.length);
    assert.equal(body.brands.length, 5);
    brands?.forEach((brand, i) => {
      assert.equal(brand.id, body.brands[i].id);
      assert.equal(brand.brandName, body.brands[i].brand_name);
    });
  });

  test('it should update a product brand', async (assert) => {
    const brand = await ProductBrandFactory.create();

    const { body } = await supertest(BASE_URL)
      .put(`/products/brands/${brand?.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(BASE_PAYLOAD)
      .expect(200);
    assert.equal(body.brand.brand_name, BASE_PAYLOAD.brandName);
    assert.notEqual(brand?.brandName, BASE_PAYLOAD.brandName);
  });
  test('it should return 422 when required data is not provided', async (assert) => {
    const brand = await ProductBrandFactory.create();
    const { body } = await supertest(BASE_URL)
      .put(`/products/brands/${brand?.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.include(body.message, 'no data provided');
  });

  test('it should delete a product brand and return 200', async (assert) => {
    const brand = await ProductBrandFactory.create();
    const { body } = await supertest(BASE_URL)
      .delete(`/products/brands/${brand?.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const searchDeletedBrand = await ProductBrand.find(brand?.id);
    assert.equal(body.message, 'Product brand deleted successfully');
    assert.notExists(searchDeletedBrand);
  });

  test('it should show a product brand', async (assert) => {
    const brand = await ProductBrandFactory.create();
    const { body } = await supertest(BASE_URL)
      .get(`/products/brands/${brand?.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    assert.deepEqual(brand!.serialize(), body.brand);
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
