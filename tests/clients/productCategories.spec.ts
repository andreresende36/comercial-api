import Database from '@ioc:Adonis/Lucid/Database';
import ProductCategory from 'App/Models/ProductCategory';
import { ProductCategoryFactory } from 'Database/factories';
import test from 'japa';
import supertest from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;
const BASE_PAYLOAD = {
  categoryName: 'Electronics',
};

test.group('Product categories', (group) => {
  test('it should create a product category', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post(`/products/categories`)
      .send(BASE_PAYLOAD)
      .expect(201);
    assert.exists(body);
    assert.exists(body.category.id);
    assert.equal(body.category.category_name, BASE_PAYLOAD.categoryName);
  });

  test('it should return 422 when required data is not provided', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post(`/products/categories`)
      .send({})
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should show all registered categories, ordered by id', async (assert) => {
    const categories = await ProductCategoryFactory.createMany(5);
    const { body } = await supertest(BASE_URL)
      .get('/products/categories')
      .expect(200);
    assert.equal(body.categories.length, categories?.length);
    assert.equal(body.categories.length, 5);
    categories?.forEach((category, i) => {
      assert.equal(category.id, body.categories[i].id);
      assert.equal(category.categoryName, body.categories[i].category_name);
    });
  });

  test('it should update a product category', async (assert) => {
    const category = await ProductCategoryFactory.create();

    const { body } = await supertest(BASE_URL)
      .put(`/products/categories/${category?.id}`)
      .send(BASE_PAYLOAD)
      .expect(200);
    assert.equal(body.category.category_name, BASE_PAYLOAD.categoryName);
    assert.notEqual(category?.categoryName, BASE_PAYLOAD.categoryName);
  });
  test('it should return 422 when required data is not provided', async (assert) => {
    const category = await ProductCategoryFactory.create();
    const { body } = await supertest(BASE_URL)
      .put(`/products/categories/${category?.id}`)
      .send({})
      .expect(422);
    assert.equal(body.code, 'BAD_REQUEST');
    assert.include(body.message, 'no data provided');
  });

  test('it should delete a product category and return 200', async (assert) => {
    const category = await ProductCategoryFactory.create();
    const { body } = await supertest(BASE_URL)
      .delete(`/products/categories/${category?.id}`)
      .expect(200);
    const searchDeletedcategory = await ProductCategory.find(category?.id);
    assert.equal(body.message, 'Product category deleted successfully');
    assert.notExists(searchDeletedcategory);
  });

  test('it should show a product category', async (assert) => {
    const category = await ProductCategoryFactory.create();
    const { body } = await supertest(BASE_URL)
      .get(`/products/categories/${category?.id}`)
      .expect(200);
    assert.deepEqual(category!.serialize(), body.category);
  });

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction();
  });
  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction();
  });
});
