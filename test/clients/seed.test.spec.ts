import { clientBuilder } from 'Database/factories';
import test from 'japa';
import {
  products,
  productsBrands,
  productsCategories,
  purchases,
} from './mockProducts';
import Product from 'App/Models/Product';
import ProductBrand from 'App/Models/ProductBrand';
import ProductCategory from 'App/Models/ProductCategory';
import Purchase from 'App/Models/Purchase';
import { DateTime } from 'luxon';

test.group('test', async () => {
  test.only('test', async () => {
    await clientBuilder(10);

    await Promise.all(
      productsBrands.map(async (productBrand) => {
        await ProductBrand.create(productBrand);
      }),
    );

    await Promise.all(
      productsCategories.map(async (productCategory) => {
        await ProductCategory.create(productCategory);
      }),
    );
    await Promise.all(
      products.map(async (product) => {
        await Product.create(product);
      }),
    );
    await Promise.all(
      purchases.map(async (purchase) => {
        await Purchase.create({
          clientId: purchase.clientId,
          quantity: purchase.quantity,
          totalPrice: purchase.totalPrice,
          unitPrice: purchase.unitPrice,
          date: DateTime.fromISO(purchase.date),
          time: DateTime.fromISO(purchase.time),
          productId: purchase.productId,
        });
      }),
    );
    const productTest = await Product.find(1);
    await productTest?.load('category');
    await productTest?.load('brand');
    console.log('ok');
    console.log(productTest?.name);
    console.log(productTest?.brand.brandName);
    console.log(productTest?.category.categoryName);
  });
});
