import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Address from 'App/Models/Address';
import CreateAddress from 'App/Validators/CreateAddressValidator';
import UpdateAddress from 'App/Validators/UpdateAddressValidator';
import BadRequest from 'App/Exceptions/BadRequestException';

export default class AddressesController {
  public async index({ response }: HttpContextContract) {
    const addresses = await Address.query().orderBy('id', 'asc');
    return response.ok({ addresses });
  }

  public async store({ request, response }: HttpContextContract) {
    const clientId = request.param('id');

    const addressPayload = await request.validate(CreateAddress);
    const address = await Address.create({ ...addressPayload, clientId });
    return response.created({ address });
  }

  public async show({ request, response }: HttpContextContract) {
    const id = request.param('id');
    const address = await Address.findOrFail(id);
    return response.ok({ address });
  }

  public async update({ request, response }: HttpContextContract) {
    if (!Object.keys(request.all()).length) {
      throw new BadRequest('no data provided', 422, 'BAD_REQUEST');
    }
    const addressPayload = await request.validate(UpdateAddress);
    const id = request.param('id');
    const address = await Address.findOrFail(id);
    address.merge(addressPayload);
    await address.save();
    return response.ok({ address });
  }

  public async delete({ request, response }: HttpContextContract) {
    const id = request.param('id');
    const address = await Address.findOrFail(id);
    await address.delete();
    return response.ok({ message: 'Address deleted successfully' });
  }
}
