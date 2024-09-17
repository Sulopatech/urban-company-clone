import { Inject, Injectable } from '@nestjs/common';
import { DeletionResponse, DeletionResult } from '@vendure/common/lib/generated-types';
import { CustomFieldsObject, ID, PaginatedList } from '@vendure/common/lib/shared-types';
import {
    CustomFieldRelationService,
    CustomerService,
    ListQueryBuilder,
    ListQueryOptions,
    Product,
    ProductService,
    ProductVariantService,
    RelationPaths,
    RequestContext,
    TransactionalConnection,
    assertFound,
    patchEntity
} from '@vendure/core';
import { REVIEW_PLUGIN_OPTIONS } from '../constants';
import { ProductReview } from '../entities/review.entity';
import { PluginInitOptions } from '../types';

// These can be replaced by generated types if you set up code generation
interface CreateProductReviewInput {
    productId: ID;
    productVariantId?: ID;
    summary: string;
    body: string;
    rating: number;
    // Define the input fields here
    customFields?: CustomFieldsObject;
}
interface UpdateProductReviewInput {
    id: ID;
    summary?: string;
    body?: string;
    rating?: number;
    // Define the input fields here
    customFields?: CustomFieldsObject;
}

@Injectable()
export class ProductReviewService {
    constructor(
        private connection: TransactionalConnection,
        private listQueryBuilder: ListQueryBuilder,
        private customFieldRelationService: CustomFieldRelationService, @Inject(REVIEW_PLUGIN_OPTIONS) private options: PluginInitOptions,
        private productService : ProductService,
        private productVariantService:ProductVariantService,
        private customerService:CustomerService,
    ) {}

    findAll(
        ctx: RequestContext,
        productId: ID,
        options?: ListQueryOptions<ProductReview>,
        relations?: RelationPaths<ProductReview>,
    ): Promise<PaginatedList<ProductReview>> {
        return this.listQueryBuilder
            .build(ProductReview, options, {
                relations,
                ctx,
                where:{
                    product:{id:productId},
                }
            }
            ).getManyAndCount().then(([items, totalItems]) => {
                return {
                    items,
                    totalItems,
                }
            }
            );
    }

    findOne(
        ctx: RequestContext,
        id: ID,
        relations?: RelationPaths<ProductReview>,
    ): Promise<ProductReview | null> {
        return this.connection
            .getRepository(ctx, ProductReview)
            .findOne({
                where: { id },
                relations,
            });
    }

    async create(ctx: RequestContext, input: CreateProductReviewInput): Promise<ProductReview> {
        
        const { productId, productVariantId, ... rest} = input;

        const product = await this.productService.findOne(ctx, productId);

        if (!product){
            throw new Error(`Product with id ${productId} not found`);
        }
        
        let productVariant = undefined;
        if (productVariantId) {
            productVariant = await this.productVariantService.findOne(ctx, productVariantId);
            if (!productVariant) {
                throw new Error(`ProductVariant with id ${productVariantId} not found`);
            }
        }

        let author = undefined;
        if (ctx.activeUserId) {
            author = await this.customerService.findOneByUserId(ctx, ctx.activeUserId);
            if(!author){
                throw new Error(`User Not Found`);
            }
        }
        else{
            throw new Error(`Please Login`);
        }

        const newEntity = await this.connection.getRepository(ctx, ProductReview).save({
            ...rest,
            product,
            productVariant,
            author,
            state: 'new',
            upvotes: 0,
            downvotes: 0,
        });
        await this.customFieldRelationService.updateRelations(ctx, ProductReview, input, newEntity);
        let v=await this.customFieldRelationService.updateRelations(ctx, Product,{customFields:{ProductReview : [newEntity.id]}},product)
        console.log(v)
        const updatedReviews = [newEntity.id];

        // Update the product's custom fields
        let w = await this.customFieldRelationService.updateRelations(
            ctx,
            Product,
            { customFields: { ProductReview: updatedReviews } },
            product
        );
        console.log(w)
        await this.productService.update(ctx, {
            id: productId,
            customFields: {
                ProductReview: newEntity.id
            },
        });
        await this.updateProductReviewMetrics(ctx,product.id)
        return assertFound(this.findOne(ctx, newEntity.id));
    }

    async update(ctx: RequestContext, input: UpdateProductReviewInput): Promise<ProductReview> {
        const entity = await this.connection.getEntityOrThrow(ctx, ProductReview, input.id);
        const updatedEntity = patchEntity(entity, input);
        await this.connection.getRepository(ctx, ProductReview).save(updatedEntity, { reload: false });
        await this.customFieldRelationService.updateRelations(ctx, ProductReview, input, updatedEntity);
        const reviews = await this.connection.getRepository(ctx, ProductReview).findOne({
            where: { id : updatedEntity.id },
            relations:{product:true}
        });
        if (!reviews){
            throw new Error(`Product with id ${updatedEntity} not found`);
        }
        // await this.updateProductReviewMetrics(ctx,reviews.product.id)
        return assertFound(this.findOne(ctx, updatedEntity.id));
    }

    async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        const entity = await this.connection.getEntityOrThrow(ctx, ProductReview, id);
        try {
            await this.connection.getRepository(ctx, ProductReview).remove(entity);
            await this.updateProductReviewMetrics(ctx, entity.product.id);
            return {
                result: DeletionResult.DELETED,
            };
        } catch (e: any) {
            return {
                result: DeletionResult.NOT_DELETED,
                message: e.toString(),
            };
        }
    }

    private async updateProductReviewMetrics(ctx: RequestContext, productId: ID): Promise<void> {
        const reviews = await this.connection.getRepository(ctx, ProductReview).find({
            where: { product: { id: productId } },
        });
        console.log("heris the update",reviews.length)
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

        await this.productService.update(ctx, {
            id: productId,
            customFields: {
                reviewRating: averageRating,
                reviewCount: reviews.length,
            },
        });
    }
    async getReviewsForProduct(
        ctx: RequestContext,
        productId: string | number,
        options: { skip?: number; take?: number } = {}
      ): Promise<{ items: ProductReview[]; totalItems: number }> {
        const take = options.take || 10;
        const skip = options.skip || 0;
        const [items, totalItems] = await this.connection
          .getRepository(ctx, ProductReview)
          .findAndCount({
            where: { product: { id: productId } },
            order: { createdAt: 'DESC' },
            take,
            skip,
          });

        return {
          items,
          totalItems,
        };
    }  
}
