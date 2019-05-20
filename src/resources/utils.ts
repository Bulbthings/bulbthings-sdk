import { request } from '../utils/http';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';
import { Utils } from '../models/utils';
import { BulbThings } from '..';

export class UtilsResource {
    constructor(private bulbthings: BulbThings) { }

    async deleteTenant(id: string): Promise<void> {
        const endpoint = (Reflect.getMetadata(
            'JsonApiModelConfig',
            Utils
        ) as JsonApiModelConfig).endpoint;

        await request('DELETE', `${this.bulbthings.basePath}/${endpoint}/${id}`, { meta: this.bulbthings.meta });
    }
}
