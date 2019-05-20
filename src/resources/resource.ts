import { JsonApiOptions } from '../interfaces/json-api-options';
import { JsonApiModel } from '../models/jsonapi-model';
import { ModelType } from '../types/model-type';
import { findAll, findById } from '../utils/find';
import { create } from '../utils/create';
import { update } from '../utils/update';
import { deleteById } from '../utils/delete';
import { BulbThings } from '..';

export class Resource<T extends JsonApiModel> {
    constructor(
        private bulbthings: BulbThings,
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

    async create(data: any): Promise<T> {
        return create(this.bulbthings, this.modelType, data);
    }

    async updateById(id: string, data: any): Promise<T> {
        return update(this.bulbthings, this.modelType, id, data);
    }

    async deleteById(id: string): Promise<void> {
        return deleteById(this.bulbthings, this.modelType, id);
    }
}

export class ReadonlyResource<T extends JsonApiModel> {
    constructor(
        private bulbthings: BulbThings,
        private modelType: ModelType<T>
    ) {}

    async findAll(options?: JsonApiOptions) {
        return findAll(this.bulbthings, this.modelType, options);
    }

    async findById(id: string, options?: JsonApiOptions): Promise<T> {
        return findById(this.bulbthings, this.modelType, id, options);
    }
}
