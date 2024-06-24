import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Client from 'App/Models/Client';
import CreateClient from 'App/Validators/CreateClientValidator';
import BadRequest from 'App/Exceptions/BadRequestException';
import UpdateCpf from 'App/Exceptions/UpdateCpfException';
import UpdateClient from 'App/Validators/UpdateClientValidator';

export default class ClientsController {
  public async store({ request, response }: HttpContextContract) {
    const clientPayload = await request.validate(CreateClient);

    const clientByCpf = await Client.findBy('cpf', clientPayload.cpf);
    if (clientByCpf) {
      throw new BadRequest('cpf already registered', 409, 'BAD_REQUEST');
    }

    const client = await Client.create(clientPayload);
    return response.created({ client });
  }

  public async index({ response }: HttpContextContract) {
    const clients = await Client.query()
      .select(['id', 'name', 'cpf'])
      .orderBy('id', 'asc');
    return response.ok({ clients });
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const client = await Client.findOrFail(params.id);
      return response.ok({ client });
    } catch (error) {
      return response.status(404).json({ message: 'Client not found' });
    }
  }

  public async update({ request, response }: HttpContextContract) {
    const { name, sex, birthdate, cpf } = await request.validate(UpdateClient);

    if (!Object.keys(request.all()).length) {
      throw new BadRequest('no data provided', 422, 'BAD_REQUEST');
    }

    if (cpf) {
      throw new UpdateCpf('cpf cannot be updated', 403, 'FORBIDDEN');
    }

    const id = request.param('id');
    const client = await Client.findOrFail(id);

    client.name = name ?? client.name;
    client.sex = sex ?? client.sex;
    client.birthdate = birthdate ?? client.birthdate;

    await client.save();
    return response.ok({ client });
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
