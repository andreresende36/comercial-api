import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Client from 'App/Models/Client';
import CreateClient from 'App/Validators/CreateClientValidator';
import BadRequest from 'App/Exceptions/BadRequestException';
import UpdateCpf from 'App/Exceptions/UpdateCpfException';
import UpdateClient from 'App/Validators/UpdateClientValidator';

export default class ClientsController {
  public async store({ request, response }: HttpContextContract) {
    const {
      name,
      cpf,
      sex,
      birthdate,
      address,
      number,
      complement,
      neighborhood,
      city,
      country,
      phoneNumber,
      state,
      zipCode,
    } = await request.validate(CreateClient);

    const clientByCpf = await Client.findBy('cpf', cpf);

    if (clientByCpf) {
      throw new BadRequest('cpf already registered', 409, 'BAD_REQUEST');
    }

    const client = await Client.create({ name, cpf, sex, birthdate });

    const _address = await client.related('addresses').updateOrCreate(
      { clientId: client.id },
      {
        address,
        number,
        complement,
        neighborhood,
        city,
        country,
        state,
        zipCode,
      },
    );
    const phone = await client
      .related('phones')
      .updateOrCreate({ clientId: client.id }, { phoneNumber });

    return response.created({ client, address: _address, phone });
  }

  public async index({ response }: HttpContextContract) {
    const clients = await Client.query()
      .select(['id', 'name', 'cpf'])
      .preload('addresses', (addressQuery) => {
        addressQuery.select(['state', 'city']);
      })
      .orderBy('id', 'asc');

    return response.ok({ clients });
  }

  // public async show({ params, response }: HttpContextContract) {
  //   try {
  //     const client = await Client.findOrFail(params.id);
  //     return response.ok({ client });
  //   } catch (error) {
  //     return response.status(404).json({ message: 'Client not found' });
  //   }
  // }

  public async update({ request, response }: HttpContextContract) {
    const {
      name,
      cpf,
      sex,
      birthdate,
      address,
      number,
      complement,
      neighborhood,
      city,
      country,
      phoneNumber,
      state,
      zipCode,
    } = await request.validate(UpdateClient);

    if (!Object.keys(request.all()).length) {
      throw new BadRequest('no data provided', 422, 'BAD_REQUEST');
    }

    if (cpf) {
      throw new UpdateCpf('cpf cannot be updated', 403, 'FORBIDDEN');
    }

    const id = request.param('id');
    const client = await Client.findOrFail(id);
    await client.load('addresses');
    await client.load('phones');

    const _address = client.addresses[0];
    const phone = client.phones[0];

    client.merge({ name, sex, birthdate });
    _address.merge({
      address,
      city,
      complement,
      country,
      neighborhood,
      number,
      zipCode,
      state,
    });
    phone.merge({ phoneNumber });

    await client.save();
    await _address.save();
    await phone.save();
    return response.ok({ client: client });
  }

  public async delete({ request, response }: HttpContextContract) {
    const id = request.param('id');
    const client = await Client.findOrFail(id);
    await client.delete();
    return response.ok({ message: 'Client deleted successfully' });
  }
}
