import test from 'japa';
import Product from 'App/Models/Product';
import supertest from 'supertest';
import Database from '@ioc:Adonis/Lucid/Database';
import {
  ProductBrandFactory,
  ProductCategoryFactory,
  ProductFactory,
  UserFactory,
} from 'Database/factories';
import ProductBrand from 'App/Models/ProductBrand';
import ProductCategory from 'App/Models/ProductCategory';
import User from 'App/Models/User';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;
const BASE_PAYLOAD = {
  price: 299.99,
  name: 'Sony WH-1000XM4',
  description: 'Noise Cancelling Wireless Headphones',
  stock: 50,
  categoryId: 1,
  brandId: 1,
};

let token = '';

test.group('Products', (group) => {
  test('it should create a product', async (assert) => {
    await ProductBrandFactory.create();
    await ProductCategoryFactory.create();
    const { body } = await supertest(BASE_URL)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send(BASE_PAYLOAD)
      .expect(201);
    delete body.product.id;
    assert.deepEqual(Object.values(body.product), Object.values(BASE_PAYLOAD));
  });

  test('it should return 422 when required data is not provided', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(422);

    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
  });

  test('it should show all registered products, ordered by name', async (assert) => {
    await ProductBrandFactory.create();
    await ProductCategoryFactory.create();
    const products = await ProductFactory.createMany(10);
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
    const { body } = await supertest(BASE_URL)
      .get('/products')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    sortedProducts?.forEach((product, i) => {
      const { id, price, name, stock } = body.products[i];
      assert.equal(id, product.id);
      assert.equal(price, product.price);
      assert.equal(name, product.name);
      assert.equal(stock, product.stock);
    });
  });

  test('it should show a single product', async (assert) => {
    await ProductBrandFactory.create();
    await ProductCategoryFactory.create();
    const product = await ProductFactory.create();
    const { body } = await supertest(BASE_URL)
      .get(`/products/${product?.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    assert.equal(body.product.id, product!.id);
    assert.equal(body.product.price, product!.price);
    assert.equal(body.product.name, product!.name);
    assert.equal(body.product.description, product!.description);
    assert.equal(body.product.stock, product!.stock);
  });

  test('it should update a product', async (assert) => {
    await ProductBrandFactory.create();
    await ProductCategoryFactory.create();
    const product = await ProductFactory.create();
    const { body } = await supertest(BASE_URL)
      .put(`/products/${product!.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(BASE_PAYLOAD)
      .expect(200);

    await product?.refresh();
    assert.deepEqual(
      { ...product?.serialize(), price: Number(product.serialize().price) },
      body.product,
    );
  });

  test('it should return 422 when required data is not provided for update', async (assert) => {
    await ProductBrandFactory.create();
    await ProductCategoryFactory.create();
    const product = await ProductFactory.create();
    const { body } = await supertest(BASE_URL)
      .put(`/products/${product?.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(422);

    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);
    assert.include(body.message, 'no data provided');
  });

  test('it should delete a product and return 200', async (assert) => {
    await ProductBrandFactory.create();
    await ProductCategoryFactory.create();
    const product = await ProductFactory.create();
    const { body } = await supertest(BASE_URL)
      .delete(`/products/${product?.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const searchDeletedProduct = await Product.findBy('id', product?.id);
    assert.equal(body.message, 'Product deleted successfully');
    assert.exists(searchDeletedProduct?.deletedAt);
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
    await Product.truncate(true);
    await ProductBrand.truncate(true);
    await ProductCategory.truncate(true);
  });

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction();
    await Product.truncate(true);
    await ProductBrand.truncate(true);
    await ProductCategory.truncate(true);
  });
});
