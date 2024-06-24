import { Exception } from '@adonisjs/core/build/standalone';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new UpdateCpfException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class UpdateCpfException extends Exception {
  public code = 'FORBIDDEN';
  public status = 403;
  public message = 'cpf cannot be updated';
  public async handle(error: this, context: HttpContextContract) {
    return context.response
      .status(error.status)
      .send({ code: error.code, message: error.message, status: error.status });
  }
}
