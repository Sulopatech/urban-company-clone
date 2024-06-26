import { PluginCommonModule, Type, VendurePlugin } from '@vendure/core';

import { CUSTOMERPROFILEPICTURE_PLUGIN_OPTIONS } from './constants';
import { PluginInitOptions } from './types';
import { CustomoreProfilePicture } from './entities/customore-profile-picture.entity';
import { CustomoreProfilePictureService } from './services/customore-profile-picture.service';
import { CustomoreProfilePictureAdminResolver } from './api/customore-profile-picture-admin.resolver';
import { adminApiExtensions } from './api/api-extensions';

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [{ provide: CUSTOMERPROFILEPICTURE_PLUGIN_OPTIONS, useFactory: () => CustomerprofilepicturePlugin.options }, CustomoreProfilePictureService],
    configuration: config => {
        config.customFields.Customer.push({
            name: 'profilePic',
            type: 'relation',
            entity: CustomoreProfilePicture,
            eager: true,
        });
        return config;
    },
    compatibility: '^2.0.0',
    entities: [CustomoreProfilePicture],
    adminApiExtensions: {
        schema: adminApiExtensions,
        resolvers: [CustomoreProfilePictureAdminResolver]
    },
    shopApiExtensions:{
        schema: adminApiExtensions,
        resolvers: [CustomoreProfilePictureAdminResolver]
    }
})
export class CustomerprofilepicturePlugin {
    static options: PluginInitOptions;

    static init(options: PluginInitOptions): Type<CustomerprofilepicturePlugin> {
        this.options = options;
        return CustomerprofilepicturePlugin;
    }
}
