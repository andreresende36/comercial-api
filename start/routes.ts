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

Route.post('/signup', 'UsersController.store');
Route.put('/users/:id', 'UsersController.update');

Route.post('/forgot-password', 'PasswordsController.forgotPassword');
Route.post('/reset-password', 'PasswordsController.resetPassword');

Route.get('/clients', 'ClientsController.index');
Route.post('/clients', 'ClientsController.store');
Route.put('/clients/:id', 'ClientsController.update');
Route.delete('/clients/:id', 'ClientsController.delete');

Route.get('/clients/:id/addresses', 'AddressesController.index');
Route.post('/clients/:id/addresses', 'AddressesController.store');
Route.get('/clients/addresses/:id', 'AddressesController.show');
Route.put('/clients/addresses/:id', 'AddressesController.update');
Route.delete('/clients/addresses/:id', 'AddressesController.delete');

Route.get('/clients/:id/phones', 'PhonesController.index');
Route.post('/clients/:id/phones', 'PhonesController.store');
Route.get('/clients/phones/:id', 'PhonesController.show');
Route.put('/clients/phones/:id', 'PhonesController.update');
Route.delete('/clients/phones/:id', 'PhonesController.delete');

Route.get('/products/categories', 'ProductCategoriesController.index');
Route.post('/products/categories', 'ProductCategoriesController.store');
Route.get('/products/categories/:id', 'ProductCategoriesController.show');
Route.put('/products/categories/:id', 'ProductCategoriesController.update');
Route.delete('/products/categories/:id', 'ProductCategoriesController.delete');

Route.get('/products/brands', 'ProductBrandsController.index');
Route.post('/products/brands', 'ProductBrandsController.store');
Route.get('/products/brands/:id', 'ProductBrandsController.show');
Route.put('/products/brands/:id', 'ProductBrandsController.update');
Route.delete('/products/brands/:id', 'ProductBrandsController.delete');
