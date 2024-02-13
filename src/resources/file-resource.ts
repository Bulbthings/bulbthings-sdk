import { JsonApiOptions } from '../interfaces/json-api-options';
import { JsonApiModel } from '../models/jsonapi-model';
import { ModelType } from '../types/model-type';
import { findAll } from '../utils/find-all';
import { findById } from '../utils/find-by-id';
import { create } from '../utils/create';
import { update } from '../utils/update';
import { deleteById } from '../utils/delete';
import { download } from '../utils/download';
import { Bulbthings } from '..';
import { RequestOptions } from '../interfaces/request-options';

export class FileResource<T extends JsonApiModel<T>> {
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

    async create(
        data: Omit<T, 'getRelationMetadata' | 'getAttributeMetadata'>,
        file?: any,
        options?: RequestOptions
    ): Promise<T> {
        return create(this.bulbthings, this.modelType, data, file, options);
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

    async download(id: string, options?: RequestOptions): Promise<any> {
        return download(this.bulbthings, this.modelType, id, options);
    }
}
