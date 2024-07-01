import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class Jwt {
  public async handle(
    { auth }: HttpContextContract,
    next: () => Promise<void>,
  ) {
    await auth.use('jwt').authenticate();
    await next();
  }
}
