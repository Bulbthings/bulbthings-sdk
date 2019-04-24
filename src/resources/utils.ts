import { request } from '../utils/http';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';
import { Utils } from '../models/utils';
import { BulbThings } from '..';

export class UtilsResource {
    constructor(private bulbthings: BulbThings) { }

    async deleteTenant(id: string): Promise<void> {
        const endpoint = (Reflect.getMetadata(
            'JsonApiModelConfig',
            this
        ) as JsonApiModelConfig).endpoint;
        console.log("==>", `${this.bulbthings.basePath}/${endpoint}/${id}`);

        await request('DELETE', `${this.bulbthings.basePath}/${endpoint}/${id}`);
    }
}
