import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ProductBrand from 'App/Models/ProductBrand';
import CreateProductBrand from 'App/Validators/CreateProductBrandValidator';
import BadRequest from 'App/Exceptions/BadRequestException';

export default class ProductBrandsController {
  public async index({ response }: HttpContextContract) {
    const brands = await ProductBrand.query().orderBy('id', 'asc');
    return response.ok({ brands });
  }

  public async store({ request, response }: HttpContextContract) {
    const brandPayload = await request.validate(CreateProductBrand);
    const conflictBrand = await ProductBrand.findBy(
      'brand_name',
      brandPayload.brandName,
    );
    if (conflictBrand) {
      throw new BadRequest('brand name already in use', 409, 'BAD_REQUEST');
    }
    const brand = await ProductBrand.create(brandPayload);
    return response.created({ brand });
  }

  public async show({ request, response }: HttpContextContract) {
    const id = request.param('id');
    const brand = await ProductBrand.findOrFail(id);
    return response.ok({ brand });
  }

  public async update({ params, request, response }: HttpContextContract) {
    if (!Object.keys(request.all()).length) {
      throw new BadRequest('no data provided', 422, 'BAD_REQUEST');
    }
    const brand = await ProductBrand.findOrFail(params.id);
    const brandPayload = await request.validate(CreateProductBrand);
    brand.merge(brandPayload);
    await brand.save();
    return response.ok({ brand });
  }

  public async delete({ request, response }: HttpContextContract) {
    const id = request.param('id');
    const brand = await ProductBrand.findOrFail(id);
    await brand.delete();
    return response.ok({ message: 'Product brand deleted successfully' });
  }
}
