import { JsonApiOptions } from '../interfaces/json-api-options';
import { JsonApiModel } from '../models/jsonapi-model';
import { ModelType } from '../types/model-type';
import { findAll } from '../utils/find-all';
import { findById } from '../utils/find-by-id';
import { BulbThings } from '..';

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
