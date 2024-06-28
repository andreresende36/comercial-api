import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Purchase from 'App/Models/Purchase';
import CreatePurchase from 'App/Validators/CreatePurchaseValidator';
import UpdatePurchase from 'App/Validators/UpdatePurchaseValidator';
import BadRequest from 'App/Exceptions/BadRequestException';

export default class PurchasesController {
  public async store({ request, response }: HttpContextContract) {
    const { quantity, unitPrice, totalPrice, date, time, clientId, productId } =
      await request.validate(CreatePurchase);

    const purchase = await Purchase.create({
      quantity,
      unitPrice,
      totalPrice: totalPrice || quantity * unitPrice,
      date,
      time,
      clientId,
      productId,
    });

    return response.created(purchase);
  }

  public async index({ response }: HttpContextContract) {
    const purchases = await Purchase.query()
      .select(['id', 'total_price', 'date', 'client_id', 'product_id'])
      .preload('client', (query) => {
        query.select(['name', 'cpf']);
      })
      .preload('product', (query) => {
        query.select(['name', 'price']);
      })
      .apply((scopes) => scopes.ignoreDeleted())
      .orderBy('id', 'asc');

    return response.ok({ purchases });
  }

  public async show({ request, response }: HttpContextContract) {
    const id = request.param('id');
    const purchase = await Purchase.query()
      .where('id', id)
      .preload('client')
      .preload('product', (productQuery) => {
        productQuery.preload('brand').preload('category');
      })
      .apply((scopes) => scopes.ignoreDeleted());
    if (purchase.length === 0)
      throw new BadRequest('purchase not found', 404, 'NOT_FOUND');
    return response.ok({ purchase });
  }

  public async update({ request, response }: HttpContextContract) {
    if (!Object.keys(request.all()).length) {
      throw new BadRequest('no data provided', 422, 'BAD_REQUEST');
    }
    const purchasePayload = await request.validate(UpdatePurchase);
    const id = request.param('id');
    const purchase = await Purchase.findOrFail(id);
    purchase.merge(purchasePayload);
    await purchase.save();
    return response.ok({ purchase });
  }

  public async delete({ request, response }: HttpContextContract) {
    const id = request.param('id');
    const purchase = await Purchase.query()
      .where('id', id)
      .apply((scopes) => scopes.ignoreDeleted())
      .firstOrFail();
    await purchase.delete();
    return response.ok({ message: 'Purchase deleted successfully' });
  }
}
