import { ApiError, Bulbthings } from '..';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';
import { JsonApiOptions } from '../interfaces/json-api-options';
import { JsonApiModel } from '../models/jsonapi-model';
import { ModelType } from '../types/model-type';
import { findAll } from '../utils/find-all';
import { findById } from '../utils/find-by-id';

export class ReadonlyResource<T extends JsonApiModel<T>> {
    constructor(
        private bulbthings: Bulbthings,
        private modelType: ModelType<T>
    ) {}

    // Allow different return types
    findAll(options?: JsonApiOptions, withMeta?: false): Promise<T[]>;
    findAll(
        options: JsonApiOptions,
        withMeta: true
    ): Promise<{
        meta: {
            offset: number;
            limit: number;
            rowCount: number;
            pageCount: number;
        };
        data: T[];
    }>;

    async findAll(options?: JsonApiOptions, withMeta = false) {
        const res = await findAll(this.bulbthings, this.modelType, options);
        return withMeta ? res : res.data;
    }

    async findById(id: string, options?: JsonApiOptions): Promise<T> {
        return findById(this.bulbthings, this.modelType, id, options);
    }

    async getCached(id: string, options?: JsonApiOptions): Promise<T> {
        const endpoint = this.getEndpoint();
        let cached = this.bulbthings.cache.get<T>(endpoint, id);
        if (cached === undefined) {
            const mId = `${endpoint}-${id}`;
            const release = await this.bulbthings.cache.getMutex(mId).acquire();
            try {
                cached =
                    this.bulbthings.cache.get(endpoint, id) ??
                    // findById will update the cache value
                    (await this.findById(id, options));
            } catch (err) {
                const status = (err as ApiError)?.errors?.[0]?.status;
                if (status === '404') {
                    this.bulbthings.cache.set(endpoint, id, null);
                } else {
                    console.error(`[${endpoint}][getCached]`, err);
                }
            } finally {
                release();
            }
        }
        return cached;
    }

    private getEndpoint() {
        return (
            Reflect.getMetadata(
                'JsonApiModelConfig',
                this.modelType
            ) as JsonApiModelConfig
        ).endpoint;
    }
}
