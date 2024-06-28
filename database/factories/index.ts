import Purchase from 'App/Models/Purchase';
import Factory from '@ioc:Adonis/Lucid/Factory';
import Client from 'App/Models/Client';
import User from 'App/Models/User';
import { faker, fakerPT_BR } from '@faker-js/faker';
import * as fakerBr from 'faker-br';
import { DateTime } from 'luxon';
import Address from 'App/Models/Address';
import Phone from 'App/Models/Phone';
import Product from 'App/Models/Product';
import ProductBrand from 'App/Models/ProductBrand';
import ProductCategory from 'App/Models/ProductCategory';

export const UserFactory = Factory.define(User, () => {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
    avatar: faker.internet.url(),
  };
}).build();

export const ClientFactory = Factory.define(Client, () => {
  return {
    name: fakerPT_BR.person.fullName(),
    cpf: fakerBr.br.cpf(),
    sex: fakerPT_BR.person.sex(),
    birthdate: DateTime.fromJSDate(
      faker.date.birthdate({ min: 18, max: 70, mode: 'age' }),
    ),
  };
}).build();

export const AddressFactory = Factory.define(Address, () => {
  return {
    address: fakerPT_BR.location.street(),
    number: fakerPT_BR.location.buildingNumber(),
    complement: fakerPT_BR.location.secondaryAddress(),
    neighborhood: fakerPT_BR.location.county(),
    zipCode: fakerPT_BR.location.zipCode(),
    city: fakerPT_BR.location.city(),
    state: fakerPT_BR.location.state({ abbreviated: true }),
    country: fakerPT_BR.location.country(),
    clientId: 1,
  };
}).build();

export const PhoneFactory = Factory.define(Phone, () => {
  return {
    phoneNumber: fakerPT_BR.phone.number(),
    clientId: 1,
  };
}).build();

export const ProductFactory = Factory.define(Product, () => {
  return {
    price: Number(fakerPT_BR.commerce.price()),
    name: fakerPT_BR.commerce.productName(),
    description: fakerPT_BR.commerce.productDescription(),
    stock: fakerPT_BR.number.int({ min: 1, max: 100 }),
    categoryId: 1,
    brandId: 1,
  };
}).build();

export const ProductBrandFactory = Factory.define(ProductBrand, () => {
  return {
    brandName: fakerPT_BR.company.name(),
  };
}).build();

export const ProductCategoryFactory = Factory.define(ProductCategory, () => {
  return {
    categoryName: fakerPT_BR.commerce.department(),
  };
}).build();

export const PurchaseFactory = Factory.define(Purchase, () => {
  const quantity = fakerPT_BR.number.int({ min: 1, max: 30 });
  const unitPrice = fakerPT_BR.number.float({ fractionDigits: 2 });
  const randomDate = faker.date.past({ years: 5 });
  const dateTime = DateTime.fromJSDate(randomDate).setZone('America/Sao_Paulo');
  return {
    quantity,
    unitPrice,
    totalPrice: quantity * unitPrice,
    date: dateTime,
    time: dateTime,
    clientId: 1,
    productId: 1,
  };
}).build();

export const factoryBuilder = async (qty: number) => {
  const clients = await ClientFactory.createMany(qty);
  const brands = await ProductBrandFactory.createMany(qty);
  const categories = await ProductCategoryFactory.createMany(qty);

  const addresses = await Promise.all(
    clients.map(async (client) => {
      const address = await AddressFactory.create();
      address.clientId = client.id;
      await address.save();
      return address;
    }),
  );

  const phones = await Promise.all(
    clients.map(async (client) => {
      const phone = await PhoneFactory.create();
      phone.clientId = client.id;
      await phone.save();
      return phone;
    }),
  );

  const products = await Promise.all(
    brands.map(async (brand, i) => {
      const product = await ProductFactory.create();
      product.brandId = brand.id;
      product.categoryId = categories[i].id;
      await product.save();
      return product;
    }),
  );

  const purchases = await Promise.all(
    clients.map(async (client, i) => {
      const purchase = await PurchaseFactory.create();
      purchase.clientId = client.id;
      purchase.productId = products[i].id;
      await purchase.save();
      return purchase;
    }),
  );

  if (qty === 1)
    return {
      client: clients[0],
      address: addresses[0],
      phone: phones[0],
      brand: brands[0],
      category: categories[0],
      product: products[0],
      purchase: purchases[0],
    };
  return {
    clients,
    addresses,
    phones,
    brands,
    categories,
    products,
    purchases,
  };
};
