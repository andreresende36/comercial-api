import Database from '@ioc:Adonis/Lucid/Database';
import ProductBrand from 'App/Models/ProductBrand';
import { factoryBuilder } from 'Database/factories';
import test from 'japa';
import supertest from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;
const BASE_PAYLOAD = {
  brandName: 'Adidas',
};

test.group('Product brands', (group) => {
  test('it should create a product brand', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post(`/products/brands`)
      .send(BASE_PAYLOAD)
      .expect(201);
    assert.exists(body);
    assert.exists(body.brand.id);
    assert.equal(body.brand.brand_name, BASE_PAYLOAD.brandName);
  });

  test('it should return 422 when required data is not provided', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post(`/products/brands`)
      .send({})
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should show all registered brands, ordered by id', async (assert) => {
    const { brands } = await factoryBuilder(5);
    const { body } = await supertest(BASE_URL)
      .get('/products/brands')
      .expect(200);
    assert.equal(body.brands.length, brands?.length);
    assert.equal(body.brands.length, 5);
    brands?.forEach((brand, i) => {
      assert.equal(brand.id, body.brands[i].id);
      assert.equal(brand.brandName, body.brands[i].brand_name);
    });
  });

  test('it should update a product brand', async (assert) => {
    const { brand } = await factoryBuilder(1);

    const { body } = await supertest(BASE_URL)
      .put(`/products/brands/${brand?.id}`)
      .send(BASE_PAYLOAD)
      .expect(200);
    assert.equal(body.brand.brand_name, BASE_PAYLOAD.brandName);
    assert.notEqual(brand?.brandName, BASE_PAYLOAD.brandName);
  });
  test('it should return 422 when required data is not provided', async (assert) => {
    const { brand } = await factoryBuilder(1);
    const { body } = await supertest(BASE_URL)
      .put(`/products/brands/${brand?.id}`)
      .send({})
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.include(body.message, 'no data provided');
  });

  test('it should delete a product brand and return 200', async (assert) => {
    const { brand } = await factoryBuilder(1);
    const { body } = await supertest(BASE_URL)
      .delete(`/products/brands/${brand?.id}`)
      .expect(200);
    const searchDeletedBrand = await ProductBrand.find(brand?.id);
    assert.equal(body.message, 'Product brand deleted successfully');
    assert.notExists(searchDeletedBrand);
  });

  test('it should show a product brand', async (assert) => {
    const { brand } = await factoryBuilder(1);
    const { body } = await supertest(BASE_URL)
      .get(`/products/brands/${brand?.id}`)
      .expect(200);
    assert.deepEqual(brand!.serialize(), body.brand);
  });

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction();
  });
  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction();
  });
});
