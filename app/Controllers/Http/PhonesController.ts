import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Phone from 'App/Models/Phone';
import PhoneValidator from 'App/Validators/PhoneValidator';
import BadRequest from 'App/Exceptions/BadRequestException';

export default class PhonesController {
  public async index({ response }: HttpContextContract) {
    const phones = await Phone.query().orderBy('id', 'asc');
    return response.ok({ phones });
  }

  public async store({ request, response }: HttpContextContract) {
    const clientId = request.param('id');

    const phonePayload = await request.validate(PhoneValidator);
    const phone = await Phone.create({ ...phonePayload, clientId });
    return response.created({ phone });
  }

  public async show({ request, response }: HttpContextContract) {
    const id = request.param('id');
    const phone = await Phone.findOrFail(id);
    return response.ok({ phone });
  }

  public async update({ request, response }: HttpContextContract) {
    if (!Object.keys(request.all()).length) {
      throw new BadRequest('no data provided', 422, 'BAD_REQUEST');
    }
    const phonePayload = await request.validate(PhoneValidator);
    const id = request.param('id');
    const phone = await Phone.findOrFail(id);
    phone.merge(phonePayload);
    await phone.save();
    return response.ok({ phone });
  }

  public async delete({ request, response }: HttpContextContract) {
    const id = request.param('id');
    const phone = await Phone.findOrFail(id);
    await phone.delete();
    return response.ok({ message: 'Phone deleted successfully' });
  }
}
