import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import UpdateUserValidator from 'App/Validators/UpdateUserValidator';

export default class UpdateUser {
  public async handle(
    { request, response, auth }: HttpContextContract,
    next: () => Promise<void>,
  ) {
    await request.validate(UpdateUserValidator);
    try {
      const id = request.param('id');
      await auth.use('jwt').authenticate();
      const user = auth.use('jwt').user!;
      if (user?.id !== Number(id)) {
        return response.unauthorized({ message: 'Unauthorized access' });
      }
      await next();
    } catch (error) {
      return response.unauthorized({ message: 'Unauthorized access' });
    }
  }
}
