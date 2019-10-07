import { JsonApiOptions } from '../interfaces/json-api-options';
import { JsonApiModel } from '../models/jsonapi-model';
import { ModelType } from '../types/model-type';
import { findAll } from '../utils/find-all';
import { findById } from '../utils/find-by-id';
import { BulbThings } from '..';

export class ReadonlyResource<T extends JsonApiModel<T>> {
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
}
