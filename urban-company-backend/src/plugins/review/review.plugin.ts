import { LanguageCode, PluginCommonModule, Type, VendurePlugin } from '@vendure/core';

import { REVIEW_PLUGIN_OPTIONS } from './constants';
import { PluginInitOptions } from './types';
import { ProductReview } from './entities/review.entity';
import { ReviewService } from './services/review.service';

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [{ provide: REVIEW_PLUGIN_OPTIONS, useFactory: () => ReviewPlugin.options }, ReviewService],
    configuration: config => {
        // Plugin-specific configuration
        // such as custom fields, custom permissions,
        // strategies etc. can be configured here by
        // modifying the `config` object.
        config.customFields.Product.push(
            {
                name: 'reviewRating',
                label: [{ languageCode: LanguageCode.en, value: 'Review rating' }],
                public: true,
                nullable: true,
                type: 'float',
            },
            {
                name: 'reviewCount',
                label: [{ languageCode: LanguageCode.en, value: 'Review count' }],
                public: true,
                defaultValue: 0,
                type: 'float',
            },
            {
                name: 'ProductReview',
                label: [{ languageCode: LanguageCode.en, value: 'Featured review' }],
                public: true,
                type: 'relation',
                list: true,
                nullable: true,
                entity: ProductReview,
                eager:true
            }
        )
        return config;
    },
    compatibility: '^3.0.0',
    entities: [ProductReview],
})
export class ReviewPlugin {
    static options: PluginInitOptions;

    static init(options: PluginInitOptions): Type<ReviewPlugin> {
        this.options = options;
        return ReviewPlugin;
    }
}
