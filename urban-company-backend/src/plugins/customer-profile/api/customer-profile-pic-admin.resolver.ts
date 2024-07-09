// src/plugins/customer-profile-pic/api/customer-profile-pic.resolver.ts

import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, Ctx, RequestContext, Transaction, Permission } from '@vendure/core';
import { CustomerProfilePicService } from '../services/customer-profile-pic';
import { CUSTOMER_PROFILE_PIC_PERMISSION } from '../constants';
import { Asset } from '@vendure/common/lib/generated-types';

@Resolver()
export class CustomerProfilePicResolver {
    constructor(private customerProfilePicService: CustomerProfilePicService) {}

    @Transaction()
    @Mutation()
    // @Allow(Permission.Authenticated)
    async setCustomerProfilePic(
        @Ctx() ctx: RequestContext,
        @Args() args: { file: any },
    ): Promise<Asset | undefined> {
        return this.customerProfilePicService.setProfilePic(ctx, args.file);
    }
}