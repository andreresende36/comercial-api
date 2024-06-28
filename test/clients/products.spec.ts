import test from 'japa';
import Product from 'App/Models/Product';
import supertest from 'supertest';
import Database from '@ioc:Adonis/Lucid/Database';
import { factoryBuilder } from 'Database/factories';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;
const BASE_PAYLOAD = {
  price: 299.99,
  name: 'Sony WH-1000XM4',
  description: 'Noise Cancelling Wireless Headphones',
  stock: 50,
  categoryId: 1,
  brandId: 1,
};

test.group('Products', (group) => {
  test('it should create a product', async (assert) => {
    await factoryBuilder(1);
    const { body } = await supertest(BASE_URL)
      .post('/products')
      .send(BASE_PAYLOAD)
      .expect(201);
    delete body.product.id;
    assert.deepEqual(Object.values(body.product), Object.values(BASE_PAYLOAD));
  });

  test('it should return 422 when required data is not provided', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/products')
      .send({})
      .expect(422);

    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should show all registered products, ordered by name', async (assert) => {
    const numberOfProducts = 10;
    const { products } = await factoryBuilder(numberOfProducts);
    products;
    const sortedProducts = products?.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    const { body } = await supertest(BASE_URL).get('/products').expect(200);
    sortedProducts?.forEach((product, i) => {
      const { id, price, name, stock } = body.products[i];
      assert.equal(id, product.id);
      assert.equal(price, product.price);
      assert.equal(name, product.name);
      assert.equal(stock, product.stock);
    });
  });

  test('it should show a single product', async (assert) => {
    const { product } = await factoryBuilder(1);
    const { body } = await supertest(BASE_URL)
      .get(`/products/${product?.id}`)
      .expect(200);
    assert.equal(body.product.id, product!.id);
    assert.equal(body.product.price, product!.price);
    assert.equal(body.product.name, product!.name);
    assert.equal(body.product.description, product!.description);
    assert.equal(body.product.stock, product!.stock);
  });

  test('it should update a product', async (assert) => {
    const { product } = await factoryBuilder(1);
    const { body } = await supertest(BASE_URL)
      .put(`/products/${product!.id}`)
      .send(BASE_PAYLOAD)
      .expect(200);

    await product?.refresh();
    assert.deepEqual(product?.serialize(), body.product);
  });

  test('it should return 422 when required data is not provided for update', async (assert) => {
    const { product } = await factoryBuilder(1);
    const { body } = await supertest(BASE_URL)
      .put(`/products/${product?.id}`)
      .send({})
      .expect(422);

    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
    assert.include(body.message, 'no data provided');
  });

  test('it should delete a product and return 200', async (assert) => {
    const { product } = await factoryBuilder(1);
    const { body } = await supertest(BASE_URL)
      .delete(`/products/${product?.id}`)
      .expect(200);
    const searchDeletedProduct = await Product.findBy('id', product?.id);
    assert.equal(body.message, 'Product deleted successfully');
    assert.exists(searchDeletedProduct?.deletedAt);
  });

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction();
  });

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction();
  });
});
