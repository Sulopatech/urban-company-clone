import { Inject, Injectable } from '@nestjs/common';
import { DeletionResponse, DeletionResult } from '@vendure/common/lib/generated-types';
import { CustomFieldsObject, ID, PaginatedList } from '@vendure/common/lib/shared-types';
import {
    CustomFieldRelationService,
    ListQueryBuilder,
    ListQueryOptions,
    RelationPaths,
    RequestContext,
    TransactionalConnection,
    TranslatableSaver,
    Translated,
    TranslationInput,
    TranslatorService,
    assertFound
} from '@vendure/core';
import { REVIEW_PLUGIN_OPTIONS } from '../constants';
import { ReviewTranslation } from '../entities/review-translation.entity';
import { Review } from '../entities/review.entity';
import { PluginInitOptions } from '../types';

// These can be replaced by generated types if you set up code generation
interface CreateReviewInput {
    code: string;
    // Define the input fields here
    customFields?: CustomFieldsObject;
    translations: Array<TranslationInput<Review>>;
}
interface UpdateReviewInput {
    id: ID;
    code?: string;
    // Define the input fields here
    customFields?: CustomFieldsObject;
    translations: Array<TranslationInput<Review>>;
}

@Injectable()
export class ReviewService {
    constructor(
        private connection: TransactionalConnection,
        private translatableSaver: TranslatableSaver,
        private listQueryBuilder: ListQueryBuilder,
        private customFieldRelationService: CustomFieldRelationService,
        private translator: TranslatorService, @Inject(REVIEW_PLUGIN_OPTIONS) private options: PluginInitOptions
    ) {}

    findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<Review>,
        relations?: RelationPaths<Review>,
    ): Promise<PaginatedList<Translated<Review>>> {
        return this.listQueryBuilder
            .build(Review, options, {
                relations,
                ctx,
            }
            ).getManyAndCount().then(([items, totalItems]) => {
                return {
                    items: items.map(item => this.translator.translate(item, ctx)),
                    totalItems,
                }
            }
            );
    }

    findOne(
        ctx: RequestContext,
        id: ID,
        relations?: RelationPaths<Review>,
    ): Promise<Translated<Review> | null> {
        return this.connection
            .getRepository(ctx, Review)
            .findOne({
                where: { id },
                relations,
            }).then(entity => entity && this.translator.translate(entity, ctx));
    }

    async create(ctx: RequestContext, input: CreateReviewInput): Promise<Translated<Review>> {
        const newEntity = await this.translatableSaver.create({
            ctx,
            input,
            entityType: Review,
            translationType: ReviewTranslation,
            beforeSave: async f => {
                // Any pre-save logic can go here
            },
        });
        await this.customFieldRelationService.updateRelations(ctx, Review, input, newEntity);
        return assertFound(this.findOne(ctx, newEntity.id));
    }

    async update(ctx: RequestContext, input: UpdateReviewInput): Promise<Translated<Review>> {
        const updatedEntity = await this.translatableSaver.update({
            ctx,
            input,
            entityType: Review,
            translationType: ReviewTranslation,
            beforeSave: async f => {
                // Any pre-save logic can go here
            },
        });
        await this.customFieldRelationService.updateRelations(ctx, Review, input, updatedEntity);
        return assertFound(this.findOne(ctx, updatedEntity.id));
    }

    async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        const entity = await this.connection.getEntityOrThrow(ctx, Review, id);
        try {
            await this.connection.getRepository(ctx, Review).remove(entity);
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
}
