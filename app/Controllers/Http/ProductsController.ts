import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Product from 'App/Models/Product';
import CreateProduct from 'App/Validators/CreateProductValidator';
import UpdateProduct from 'App/Validators/UpdateProductValidator';
import BadRequest from 'App/Exceptions/BadRequestException';

export default class ProductsController {
  public async store({ request, response }: HttpContextContract) {
    const productPayload = await request.validate(CreateProduct);
    const product = await Product.create(productPayload);
    return response.created({ product });
  }

  public async update({ request, response }: HttpContextContract) {
    if (!Object.keys(request.all()).length) {
      throw new BadRequest('no data provided', 422, 'BAD_REQUEST');
    }
    const productPayload = await request.validate(UpdateProduct);
    const id = request.param('id');
    const product = await Product.findOrFail(id);
    product.merge(productPayload);
    await product.save();
    return response.ok({ product });
  }

  public async index({ response }: HttpContextContract) {
    const products = await Product.query()
      .select(['id', 'name', 'price', 'stock'])
      .apply((scopes) => scopes.ignoreDeleted())
      .orderBy('name', 'asc');
    return response.ok({ products });
  }

  public async show({ request, response }: HttpContextContract) {
    const id = request.param('id');
    const [product] = await Product.query()
      .where('id', id)
      .preload('brand')
      .preload('category')
      .apply((scopes) => scopes.ignoreDeleted());

    if (!product) throw new BadRequest('product not found', 404, 'NOT_FOUND');
    return response.ok({ product });
  }

  public async delete({ request, response }: HttpContextContract) {
    const id = request.param('id');
    const product = await Product.query()
      .where('id', id)
      .apply((scopes) => scopes.ignoreDeleted())
      .firstOrFail();
    await product.delete(); // Exclusão lógica
    return response.ok({ message: 'Product deleted successfully' });
  }
}
