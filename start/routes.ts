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

Route.get('/clients/index', 'ClientsController.index');
Route.post('/clients/store', 'ClientsController.store');
Route.put('/clients/update/:id', 'ClientsController.update');
Route.delete('/clients/delete/:id', 'ClientsController.delete');

Route.get('/clients/:id/addresses', 'AddressesController.index');
Route.post('/clients/:id/addresses', 'AddressesController.store');
Route.get('/clients/:id/addresses/:addressId', 'AddressesController.show');
Route.put('/clients/:id/addresses/:addressId', 'AddressesController.update');
Route.delete(
  '/clients/:id/addresses/:address-id',
  'AddressesController.delete',
);

Route.get('/clients/:id/phones', 'PhonesController.index');
Route.post('/clients/:id/phones', 'PhonesController.store');
Route.get('/clients/:id/phones/:phoneId', 'PhonesController.show');
Route.put('/clients/:id/phones/:phoneId', 'PhonesController.update');
Route.delete('/clients/:id/phones/:phoneId', 'PhonesController.delete');
