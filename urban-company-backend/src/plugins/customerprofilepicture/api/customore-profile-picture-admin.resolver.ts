import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DeletionResponse, Permission } from '@vendure/common/lib/generated-types';
import { CustomFieldsObject } from '@vendure/common/lib/shared-types';
import {
    Allow,
    Ctx,
    PaginatedList,
    RequestContext,
    Transaction,
    Relations,
    VendureEntity,
    ID,
    TranslationInput,
    ListQueryOptions,
    RelationPaths,
} from '@vendure/core';
import { CustomoreProfilePictureService } from '../services/customore-profile-picture.service';
import { CustomoreProfilePicture } from '../entities/customore-profile-picture.entity';

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

@Resolver()
export class CustomoreProfilePictureAdminResolver {
    constructor(private customoreProfilePictureService: CustomoreProfilePictureService) {}

    @Query()
    @Allow(Permission.SuperAdmin)
    async customoreProfilePicture(
        @Ctx() ctx: RequestContext,
        @Args() args: { id: ID },
        @Relations(CustomoreProfilePicture) relations: RelationPaths<CustomoreProfilePicture>,
    ): Promise<CustomoreProfilePicture | null> {
        return this.customoreProfilePictureService.findOne(ctx, args.id, relations);
    }

    @Query()
    @Allow(Permission.SuperAdmin)
    async customoreProfilePictures(
        @Ctx() ctx: RequestContext,
        @Args() args: { options: ListQueryOptions<CustomoreProfilePicture> },
        @Relations(CustomoreProfilePicture) relations: RelationPaths<CustomoreProfilePicture>,
    ): Promise<PaginatedList<CustomoreProfilePicture>> {
        return this.customoreProfilePictureService.findAll(ctx, args.options || undefined, relations);
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.SuperAdmin)
    async createCustomoreProfilePicture(
        @Ctx() ctx: RequestContext,
        @Args() args: { input: CreateCustomoreProfilePictureInput },
    ): Promise<CustomoreProfilePicture> {
        return this.customoreProfilePictureService.create(ctx, args.input);
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.SuperAdmin)
    async updateCustomoreProfilePicture(
        @Ctx() ctx: RequestContext,
        @Args() args: { input: UpdateCustomoreProfilePictureInput },
    ): Promise<CustomoreProfilePicture> {
        return this.customoreProfilePictureService.update(ctx, args.input);
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.SuperAdmin)
    async deleteCustomoreProfilePicture(@Ctx() ctx: RequestContext, @Args() args: { id: ID }): Promise<DeletionResponse> {
        return this.customoreProfilePictureService.delete(ctx, args.id);
    }
}
