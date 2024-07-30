import { AssetNamingStrategy, AssetPreviewStrategy, AssetStorageStrategy, RequestContext } from "@vendure/core";

/**
 * @description
 * The plugin can be configured using the following options:
 */
export type ImageTransformFormat = 'jpg' | 'jpeg' | 'png' | 'webp' | 'avif';
export type ImageTransformMode = 'crop' | 'resize';
export interface ProfileImageError {
    errorCode: string;
    message: string;
}
export interface ImageTransformPreset {
    name: string;
    width: number;
    height: number;
    mode: ImageTransformMode;
}

export type CacheConfig = {
    /**
     * @description
     * The max-age=N response directive indicates that the response remains fresh until N seconds after the response is generated.
     */
    maxAge: number;
    /**
     * @description
     * The `private` response directive indicates that the response can be stored only in a private cache (e.g. local caches in browsers).
     * The `public` response directive indicates that the response can be stored in a shared cache.
     */
    restriction?: 'public' | 'private';
};

export interface ProfileInitOptions {
    route: string;
    /**
     * @description
     * The local directory to which assets will be uploaded when using the {@link LocalAssetStorageStrategy}.
     */
    assetUploadDir: string;
    /**
     * @description
     * The complete URL prefix of the asset files. For example, "https://demo.vendure.io/assets/". A
     * function can also be provided to handle more complex cases, such as serving multiple domains
     * from a single server. In this case, the function should return a string url prefix.
     *
     * If not provided, the plugin will attempt to guess based off the incoming
     * request and the configured route. However, in all but the simplest cases,
     * this guess may not yield correct results.
     */
    assetUrlPrefix?: string | ((ctx: RequestContext, identifier: string) => string);
    /**
     * @description
     * The max width in pixels of a generated preview image.
     *
     * @default 1600
     * @deprecated Use `previewStrategy: new SharpAssetPreviewStrategy({ maxWidth })` instead
     */
    previewMaxWidth?: number;
    /**
     * @description
     * The max height in pixels of a generated preview image.
     *
     * @default 1600
     * @deprecated Use `previewStrategy: new SharpAssetPreviewStrategy({ maxHeight })` instead
     */
    previewMaxHeight?: number;
    /**
     * @description
     * An array of additional {@link ImageTransformPreset} objects.
     */
    presets?: ImageTransformPreset[];
    /**
     * @description
     * Defines how asset files and preview images are named before being saved.
     *
     * @default HashedAssetNamingStrategy
     */
    namingStrategy?: AssetNamingStrategy;
    /**
     * @description
     * Defines how previews are generated for a given Asset binary. By default, this uses
     * the {@link SharpAssetPreviewStrategy}
     *
     * @since 1.7.0
     */
    previewStrategy?: AssetPreviewStrategy;
    /**
     * @description
     * A function which can be used to configure an {@link AssetStorageStrategy}. This is useful e.g. if you wish to store your assets
     * using a cloud storage provider. By default, the {@link LocalAssetStorageStrategy} is used.
     *
     * @default () => LocalAssetStorageStrategy
     */
    storageStrategyFactory?: (options: ProfileInitOptions) => AssetStorageStrategy | Promise<AssetStorageStrategy>;
    /**
     * @description
     * Configures the `Cache-Control` directive for response to control caching in browsers and shared caches (e.g. Proxies, CDNs).
     * Defaults to publicly cached for 6 months.
     *
     * @default 'public, max-age=15552000'
     * @since 1.9.3
     */
    cacheHeader?: CacheConfig | string;

}
