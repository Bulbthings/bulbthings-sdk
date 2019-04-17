import { JsonApiOptions } from '../interfaces/json-api-options';
import { JsonApiModel } from '../models/jsonapi-model';
import { ModelType } from '../types/model-type';
import { findAll, findById } from '../utils/find';
import { create } from '../utils/create';
import { deleteById } from '../utils/delete';
import BulbThings from '..';

export class Resource<T extends JsonApiModel> {
    constructor(
        private bulbthings: BulbThings,
        private modelType: ModelType<T>
    ) {}

    async findAll(options?: JsonApiOptions) {
        return findAll(this.bulbthings, this.modelType, options);
    }

    async findById(id: string, options?: JsonApiOptions) {
        return findById(this.bulbthings, this.modelType, id, options);
    }

    async create(data: any) {
        return create(this.bulbthings, this.modelType, data);
    }

    async deleteById(id: string) {
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

    async findById(id: string, options?: JsonApiOptions) {
        return findById(this.bulbthings, this.modelType, id, options);
    }
}
