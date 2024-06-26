import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ProductCategory from 'App/Models/ProductCategory';
import CreateProductCategory from 'App/Validators/CreateProductCategoryValidator';
import BadRequest from 'App/Exceptions/BadRequestException';

export default class ProductCategoriesController {
  public async index({ response }: HttpContextContract) {
    const categories = await ProductCategory.query().orderBy('id', 'asc');
    return response.ok(categories);
  }

  public async store({ request, response }: HttpContextContract) {
    const categoryPayload = await request.validate(CreateProductCategory);
    const conflictCategory = await ProductCategory.findBy(
      'category_name',
      categoryPayload.categoryName,
    );
    if (conflictCategory) {
      throw new BadRequest('category name already in use', 409, 'BAD_REQUEST');
    }
    const category = await ProductCategory.create(categoryPayload);
    return response.created(category);
  }

  public async show({ params, response }: HttpContextContract) {
    const category = await ProductCategory.findOrFail(params.id);
    return response.ok(category);
  }

  public async update({ params, request, response }: HttpContextContract) {
    const category = await ProductCategory.findOrFail(params.id);
    const categoryPayload = await request.validate(CreateProductCategory);
    category.merge(categoryPayload);
    await category.save();
    return response.ok(category);
  }

  public async destroy({ params, response }: HttpContextContract) {
    const category = await ProductCategory.findOrFail(params.id);
    await category.delete();
    return response.ok({ message: 'Product category deleted successfully' });
  }
}
