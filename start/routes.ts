/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route';

Route.get('/', async () => {
  return { message: 'Seja bem-vindo!' };
});

// Users
Route.post('/signup', 'UsersController.store');
Route.put('/users/:id', 'UsersController.update').middleware('updateUser');

// Password
Route.post('/forgot-password', 'PasswordsController.forgotPassword');
Route.post('/reset-password', 'PasswordsController.resetPassword');

// Athentication
Route.post('/login', 'SessionsController.store');
Route.delete('/login', 'SessionsController.delete').middleware('jwt');
Route.post('/refresh', 'SessionsController.refresh');

// Addresses
Route.get('/clients/:id/addresses', 'AddressesController.index').middleware(
  'jwt',
);
Route.post('/clients/:id/addresses', 'AddressesController.store').middleware(
  'jwt',
);
Route.get('/clients/addresses/:id', 'AddressesController.show').middleware(
  'jwt',
);
Route.put('/clients/addresses/:id', 'AddressesController.update').middleware(
  'jwt',
);
Route.delete('/clients/addresses/:id', 'AddressesController.delete').middleware(
  'jwt',
);

// Phones
Route.get('/clients/:id/phones', 'PhonesController.index').middleware('jwt');
Route.post('/clients/:id/phones', 'PhonesController.store').middleware('jwt');
Route.get('/clients/phones/:id', 'PhonesController.show').middleware('jwt');
Route.put('/clients/phones/:id', 'PhonesController.update').middleware('jwt');
Route.delete('/clients/phones/:id', 'PhonesController.delete').middleware(
  'jwt',
);
// Clients
Route.get('/clients', 'ClientsController.index').middleware('jwt');
Route.post('/clients', 'ClientsController.store').middleware('jwt');
Route.get('/clients/:id', 'ClientsController.show').middleware('jwt');
Route.put('/clients/:id', 'ClientsController.update').middleware('jwt');
Route.delete('/clients/:id', 'ClientsController.delete').middleware('jwt');

// Products categories
Route.get(
  '/products/categories',
  'ProductCategoriesController.index',
).middleware('jwt');
Route.post(
  '/products/categories',
  'ProductCategoriesController.store',
).middleware('jwt');
Route.get(
  '/products/categories/:id',
  'ProductCategoriesController.show',
).middleware('jwt');
Route.put(
  '/products/categories/:id',
  'ProductCategoriesController.update',
).middleware('jwt');
Route.delete(
  '/products/categories/:id',
  'ProductCategoriesController.delete',
).middleware('jwt');

// Products brands
Route.get('/products/brands', 'ProductBrandsController.index').middleware(
  'jwt',
);
Route.post('/products/brands', 'ProductBrandsController.store').middleware(
  'jwt',
);
Route.get('/products/brands/:id', 'ProductBrandsController.show').middleware(
  'jwt',
);
Route.put('/products/brands/:id', 'ProductBrandsController.update').middleware(
  'jwt',
);
Route.delete(
  '/products/brands/:id',
  'ProductBrandsController.delete',
).middleware('jwt');

// Products
Route.get('/products', 'ProductsController.index').middleware('jwt');
Route.post('/products', 'ProductsController.store').middleware('jwt');
Route.get('/products/:id', 'ProductsController.show').middleware('jwt');
Route.put('/products/:id', 'ProductsController.update').middleware('jwt');
Route.delete('/products/:id', 'ProductsController.delete').middleware('jwt');

//Purchases
Route.get('/purchases', 'PurchasesController.index').middleware('jwt');
Route.post('/purchases', 'PurchasesController.store').middleware('jwt');
Route.get('/purchases/:id', 'PurchasesController.show').middleware('jwt');
Route.put('/purchases/:id', 'PurchasesController.update').middleware('jwt');
Route.delete('/purchases/:id', 'PurchasesController.delete').middleware('jwt');
