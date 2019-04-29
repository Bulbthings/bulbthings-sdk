import { JsonApiOptions } from '../interfaces/json-api-options';
import { JsonApiUpdateOptions } from '../interfaces/json-api-update-options';
import { JsonApiModel } from '../models/jsonapi-model';
import { ModelType } from '../types/model-type';
import { findAll, findById } from '../utils/find';
import { create } from '../utils/create';
import { updateAll, updateById } from '../utils/update';
import { deleteById } from '../utils/delete';
import { BulbThings } from '..';

export class Resource<T extends JsonApiModel> {
    constructor(
        private bulbthings: BulbThings,
        private modelType: ModelType<T>
    ) { }

    async findAll(options?: JsonApiOptions) {
        return findAll(this.bulbthings, this.modelType, options);
    }

    async findById(id: string, options?: JsonApiOptions) {
        return findById(this.bulbthings, this.modelType, id, options);
    }

    async create(data: any) {
        return create(this.bulbthings, this.modelType, data);
    }

    async updateAll(data: any, options: JsonApiUpdateOptions) {
        return updateAll(this.bulbthings, this.modelType, data, options);
    }

    async updateById(id: string, data: any, options?: JsonApiUpdateOptions) {
        return updateById(this.bulbthings, this.modelType, id, data, options);
    }

    async deleteById(id: string) {
        return deleteById(this.bulbthings, this.modelType, id);
    }
}

export class ReadonlyResource<T extends JsonApiModel> {
    constructor(
        private bulbthings: BulbThings,
        private modelType: ModelType<T>
    ) { }

    async findAll(options?: JsonApiOptions) {
        return findAll(this.bulbthings, this.modelType, options);
    }

    async findById(id: string, options?: JsonApiOptions) {
        return findById(this.bulbthings, this.modelType, id, options);
    }
}

// export class ActiveResource<T extends JsonApiModel> {
//     constructor(bulb) { }

//     async refresh() { }
// }
