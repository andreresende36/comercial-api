import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Client from 'App/Models/Client';
import CreateClient from 'App/Validators/CreateClientValidator';
import BadRequest from 'App/Exceptions/BadRequestException';

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
    const clients = await Client.all();
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

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const client = await Client.findOrFail(params.id);
      const data = request.only(['name', 'cpf', 'gender', 'birthDate']);
      client.merge(data);
      await client.save();
      return response.status(200).json(client);
    } catch (error) {
      return response.status(404).json({ message: 'Client not found' });
    }
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
