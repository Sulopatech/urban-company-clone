import { Inject, Injectable } from '@nestjs/common';
import { DeletionResponse, DeletionResult } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import {
    ListQueryBuilder,
    ListQueryOptions,
    RelationPaths,
    RequestContext,
    TransactionalConnection,
    assertFound,
    patchEntity
} from '@vendure/core';
import { CUSTOMERPROFILEPICTURE_PLUGIN_OPTIONS } from '../constants';
import { CustomoreProfilePicture } from '../entities/customore-profile-picture.entity';
import { PluginInitOptions } from '../types';

// These can be replaced by generated types if you set up code generation
interface CreateCustomoreProfilePictureInput {
    code: string;
    // Define the input fields here
}
interface UpdateCustomoreProfilePictureInput {
    id: ID;
    code?: string;
    // Define the input fields here
}

@Injectable()
export class CustomoreProfilePictureService {
    constructor(
        private connection: TransactionalConnection,
        private listQueryBuilder: ListQueryBuilder, @Inject(CUSTOMERPROFILEPICTURE_PLUGIN_OPTIONS) private options: PluginInitOptions
    ) {}

    findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<CustomoreProfilePicture>,
        relations?: RelationPaths<CustomoreProfilePicture>,
    ): Promise<PaginatedList<CustomoreProfilePicture>> {
        return this.listQueryBuilder
            .build(CustomoreProfilePicture, options, {
                relations,
                ctx,
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
        relations?: RelationPaths<CustomoreProfilePicture>,
    ): Promise<CustomoreProfilePicture | null> {
        return this.connection
            .getRepository(ctx, CustomoreProfilePicture)
            .findOne({
                where: { id },
                relations,
            });
    }

    async create(ctx: RequestContext, input: CreateCustomoreProfilePictureInput): Promise<CustomoreProfilePicture> {
        const newEntity = await this.connection.getRepository(ctx, CustomoreProfilePicture).save(input);
        return assertFound(this.findOne(ctx, newEntity.id));
    }

    async update(ctx: RequestContext, input: UpdateCustomoreProfilePictureInput): Promise<CustomoreProfilePicture> {
        const entity = await this.connection.getEntityOrThrow(ctx, CustomoreProfilePicture, input.id);
        const updatedEntity = patchEntity(entity, input);
        await this.connection.getRepository(ctx, CustomoreProfilePicture).save(updatedEntity, { reload: false });
        return assertFound(this.findOne(ctx, updatedEntity.id));
    }

    async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        const entity = await this.connection.getEntityOrThrow(ctx, CustomoreProfilePicture, id);
        try {
            await this.connection.getRepository(ctx, CustomoreProfilePicture).remove(entity);
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
