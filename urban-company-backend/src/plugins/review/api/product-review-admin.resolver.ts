import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DeletionResponse, Permission } from '@vendure/common/lib/generated-types';
import { CustomFieldsObject } from '@vendure/common/lib/shared-types';
import {
    Allow,
    Ctx,
    ID,
    ListQueryOptions,
    PaginatedList,
    RelationPaths,
    Relations,
    RequestContext,
    Transaction
} from '@vendure/core';
import { ProductReview } from '../entities/review.entity';
import { ProductReviewService } from '../services/product-review.service';

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

@Resolver()
export class ProductReviewAdminResolver {
    constructor(private productReviewService: ProductReviewService) {}

    @Query()
    @Allow(Permission.Public)
    async productReview(
        @Ctx() ctx: RequestContext,
        @Args() args: { id: ID },
        @Relations(ProductReview) relations: RelationPaths<ProductReview>,
    ): Promise<ProductReview | null> {
        return this.productReviewService.findOne(ctx, args.id, relations);
    }

    @Query()
    @Allow(Permission.Public)
    async productReviews(
        @Ctx() ctx: RequestContext,
        @Args() args: { productId: ID, options: ListQueryOptions<ProductReview> },

        @Relations(ProductReview) relations: RelationPaths<ProductReview>,
    ): Promise<PaginatedList<ProductReview>> {
        return this.productReviewService.findAll(ctx, args.productId ,args.options || undefined, relations);
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.Public)
    async createProductReview(
        @Ctx() ctx: RequestContext,
        @Args() args: { input: CreateProductReviewInput },
    ): Promise<ProductReview> {
        return this.productReviewService.create(ctx, args.input);
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.Public)
    async updateProductReview(
        @Ctx() ctx: RequestContext,
        @Args() args: { input: UpdateProductReviewInput },
    ): Promise<ProductReview> {
        return this.productReviewService.update(ctx, args.input);
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.Public)
    async deleteProductReview(@Ctx() ctx: RequestContext, @Args() args: { id: ID }): Promise<DeletionResponse> {
        return this.productReviewService.delete(ctx, args.id);
    }
}
