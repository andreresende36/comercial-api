import Mail from '@ioc:Adonis/Addons/Mail';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';

export default class PasswordsController {
  public async forgotPassword({ request, response }: HttpContextContract) {
    const { email, resetPasswordUrl } = request.only([
      'email',
      'resetPasswordUrl',
    ]);
    const { username } = await User.findByOrFail('email', email);
    const subject = 'Recuperação de senha';

    await Mail.send((message) => {
      message
        .from('no-reply@ecommerce.com')
        .to(email)
        .subject(subject)
        .htmlView('email/forgotpassword', {
          productName: 'Ecommerce',
          name: username,
          resetPasswordUrl,
        });
    });
    return response.noContent();
  }
}
