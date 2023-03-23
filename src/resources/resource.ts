import { ApiError, Bulbthings } from '..';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';
import { JsonApiOptions } from '../interfaces/json-api-options';
import { RequestOptions } from '../interfaces/request-options';
import { JsonApiModel } from '../models/jsonapi-model';
import { ModelType } from '../types/model-type';
import { create } from '../utils/create';
import { deleteById } from '../utils/delete';
import { findAll } from '../utils/find-all';
import { findById } from '../utils/find-by-id';
import { update } from '../utils/update';

export class Resource<T extends JsonApiModel<T>> {
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
            total: number;
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

    async getCached(id: string): Promise<T> {
        const endpoint = this.getEndpoint();
        let cached = this.bulbthings.cache.get(endpoint, id);
        if (!cached) {
            const mId = `${this.getEndpoint()}-${id}`;
            const release = await this.bulbthings.cache.getMutex(mId).acquire();
            try {
                cached =
                    this.bulbthings.cache.get(endpoint, id) ??
                    (await this.findById(id));
            } catch (err) {
                if ((err as ApiError)?.errors?.[0]?.status !== '404') {
                    console.error(`[${endpoint}][getCached]`, err);
                }
            } finally {
                release();
            }
        }
        return cached;
    }

    async create(
        data: Omit<T, 'getRelationMetadata' | 'getAttributeMetadata'>,
        options?: RequestOptions
    ): Promise<T> {
        return create(this.bulbthings, this.modelType, data, null, options);
    }

    async updateById(
        id: string,
        data: any,
        options?: RequestOptions
    ): Promise<T> {
        return update(this.bulbthings, this.modelType, id, data, options);
    }

    async deleteById(id: string, options?: RequestOptions): Promise<void> {
        return deleteById(this.bulbthings, this.modelType, id, options);
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
