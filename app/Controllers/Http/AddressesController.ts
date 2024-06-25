import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Address from 'App/Models/Address';
import CreateAddress from 'App/Validators/CreateAddressValidator';

export default class AddressesController {
  public async index({}: HttpContextContract) {
    const addresses = await Address.all();
    return addresses;
  }

  public async store({ request, response }: HttpContextContract) {
    const clientId = request.param('id');

    const addressPayload = await request.validate(CreateAddress);
    const address = await Address.create({ ...addressPayload, clientId });
    return response.created({ address });
  }

  public async show({ params }: HttpContextContract) {
    const address = await Address.findOrFail(params.id);
    return address;
  }

  public async update({ params, request }: HttpContextContract) {
    const address = await Address.findOrFail(params.id);
    const data = request.only(['street', 'number', 'city', 'state', 'country']);
    address.merge(data);
    await address.save();
    return address;
  }

  public async delete({ params }: HttpContextContract) {
    const address = await Address.findOrFail(params.id);
    await address.delete();
    return address;
  }
}
