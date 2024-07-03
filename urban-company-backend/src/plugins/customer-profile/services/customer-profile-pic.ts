// src/plugins/customer-profile-pic/services/customer-profile-pic.service.ts

import { Injectable } from '@nestjs/common';
import { 
    Asset as AssetEntity, 
    AssetService, 
    CustomerService, 
    RequestContext, 
    isGraphQlErrorResult,
    ConfigService
} from '@vendure/core';
import { Asset, AssetType, Coordinate } from '@vendure/common/lib/generated-types';

@Injectable()
export class CustomerProfilePicService {
    constructor(
        private assetService: AssetService,
        private customerService: CustomerService,
        private configService: ConfigService
    ) {}

    async setProfilePic(ctx: RequestContext, file: any): Promise<Asset | undefined> {
        const userId = ctx.activeUserId;
        if (!userId) {
            return undefined;
        }

        const customer = await this.customerService.findOneByUserId(ctx, userId);
        if (!customer) {
            return undefined;
        }

        const asset = await this.assetService.create(ctx, {
            file,
            tags: ['profile-pic'],
        });

        if (isGraphQlErrorResult(asset)) {
            throw asset;
        }

        await this.customerService.update(ctx, {
            id: customer.id,
            customFields: {
                profilePicId: asset.id,
            },
        });

        // Convert AssetEntity to Asset (GraphQL type)
        const assetGraphQL: Asset = {
            id: asset.id,
            createdAt: asset.createdAt,
            updatedAt: asset.updatedAt,
            name: asset.name,
            type: asset.type as AssetType,
            fileSize: asset.fileSize,
            mimeType: asset.mimeType,
            width: asset.width,
            height: asset.height,
            source: asset.source,
            preview: asset.preview,
            focalPoint: asset.focalPoint as Coordinate ,
            tags: asset.tags.map((tag: any) => tag.value),
            customFields: asset.customFields
        };

        return assetGraphQL;
    }
}