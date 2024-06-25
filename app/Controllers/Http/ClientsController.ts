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
    const clientById = await Client.findOrFail(id);

    await clientById.load('addresses');
    await clientById.load('phones');

    clientById.name = name ?? clientById.name;
    clientById.sex = sex ?? clientById.sex;
    clientById.birthdate = birthdate ?? clientById.birthdate;
    if (clientById.addresses.length > 0) {
      // É possível atualizar junto o endereço principal
      const clientAddress = clientById.addresses[0];
      clientAddress.address = address ?? clientAddress.address;
      clientAddress.number = number ?? clientAddress.number;
      clientAddress.complement = complement ?? clientAddress.complement;
      clientAddress.neighborhood = neighborhood ?? clientAddress.neighborhood;
      clientAddress.city = city ?? clientAddress.city;
      clientAddress.state = state ?? clientAddress.state;
      clientAddress.zipCode = zipCode ?? clientAddress.zipCode;
      clientAddress.country = country ?? clientAddress.country;

      await clientAddress.save();
    }

    if (clientById.phones.length > 0) {
      // É possível atualizar junto o telefone principal
      const clientPhone = clientById.phones[0];
      clientPhone.phoneNumber = phoneNumber ?? clientPhone.phoneNumber;
      await clientPhone.save();
    }

    await clientById.save();
    return response.ok({ client: clientById });
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const client = await Client.findOrFail(params.id);
      await client.delete();
      return response
        .status(200)
        .json({ message: 'Client deleted successfully' });
    } catch (error) {
      return response.status(404).json({ message: 'Client not found' });
    }
  }
}
