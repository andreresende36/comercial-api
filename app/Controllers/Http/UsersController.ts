import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BadRequest from 'App/Exceptions/BadRequestException';
import User from 'App/Models/User';
import CreateUser from 'App/Validators/CreateUserValidator';

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const userPayload = await request.validate(CreateUser);

    const userByEmail = await User.findBy('email', userPayload.email);
    if (userByEmail) {
      throw new BadRequest('email already in use', 409, 'BAD_REQUEST');
    }

    const userByUsername = await User.findBy('username', userPayload.username);
    if (userByUsername) {
      throw new BadRequest('username already in use', 409, 'BAD_REQUEST');
    }

    const user = await User.create(userPayload);
    return response.created({ user });
  }

  public async update({ request, response }: HttpContextContract) {
    const { email, avatar, password } = request.only([
      'email',
      'avatar',
      'password',
    ]);
    const id = request.param('id');
    const user = await User.findOrFail(id);

    user.email = email;
    if (avatar) user.avatar = avatar;
    user.password = password;

    await user.save();
    return response.ok({ user });
  }
}
