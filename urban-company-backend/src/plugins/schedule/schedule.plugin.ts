import { PluginCommonModule, Type, VendurePlugin } from '@vendure/core';

import { SCHEDULE_PLUGIN_OPTIONS } from './constants';
import { PluginInitOptions } from './types';
import { Schedule } from './entities/schedule.entity';
import { ScheduleService } from './services/schedule.service';
import { ScheduleResolver } from './api/schedule.resolver';
import { adminApiExtensions } from './api/api-extensions';

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [{ provide: SCHEDULE_PLUGIN_OPTIONS, useFactory: () => SchedulePlugin.options }, ScheduleService],
    configuration: config => {
        // Plugin-specific configuration
        // such as custom fields, custom permissions,
        // strategies etc. can be configured here by
        // modifying the `config` object.
        config.customFields.Order.push(
            {
                name: 'Schedule',
                type: 'relation',
                entity: Schedule,
                nullable: true,
                eager: true
            }
        )
        return config;
    },
    compatibility: '^3.0.0',
    entities: [Schedule],
    adminApiExtensions: {
        schema: adminApiExtensions,
        resolvers: [ScheduleResolver]
    },
    shopApiExtensions:{
        schema: adminApiExtensions,
        resolvers: [ScheduleResolver]
    },
})
export class SchedulePlugin {
    static options: PluginInitOptions;

    static init(options: PluginInitOptions): Type<SchedulePlugin> {
        this.options = options;
        return SchedulePlugin;
    }
}
