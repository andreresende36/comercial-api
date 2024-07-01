import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class SessionsController {
  public async store({ auth, request, response }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password']);
    const token = await auth.use('jwt').attempt(email, password);
    return response.created({
      token,
      user: auth.use('jwt').user,
    });
  }
  public async delete({ auth, response }: HttpContextContract) {
    await auth.use('jwt').revoke();
    return response.ok({ message: 'Successful logout' });
  }
  public async refresh({ auth, request, response }: HttpContextContract) {
    const refreshToken = request.input('refresh_token');
    const jwt = await auth.use('jwt').loginViaRefreshToken(refreshToken);
    return response.ok({ message: 'Token refreshed successfully', token: jwt });
  }
}
