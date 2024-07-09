// src/plugins/customer-profile-pic/customer-profile-pic.plugin.ts

import { Asset, LanguageCode, PluginCommonModule, VendurePlugin, Type } from '@vendure/core';
import { shopApiExtensions } from './api/api-extensions';
import { CustomerProfilePicResolver } from './api/customer-profile-pic-admin.resolver';
import { CustomerProfilePicService } from './services/customer-profile-pic';

export interface CustomerProfilePicPluginOptions {
    route: string;
    assetUploadDir: string;
}

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [CustomerProfilePicService],
    shopApiExtensions: {
        schema: shopApiExtensions,
        resolvers: [CustomerProfilePicResolver],
    },
    configuration: config => {
        config.customFields.Customer.push({
            name: 'profilePic',
            type: 'relation',
            label: [{ languageCode: LanguageCode.en, value: 'Profile Picture' }],
            entity: Asset,
            nullable: true,
            eager: true
        });
        return config;
    },
})
export class CustomerProfilePicPlugin {
    static options: CustomerProfilePicPluginOptions;

    static init(options: CustomerProfilePicPluginOptions): Type<CustomerProfilePicPlugin> {
        this.options = options;
        return this;
    }
}