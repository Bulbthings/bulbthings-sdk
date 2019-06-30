import fetch from 'cross-fetch';
import * as JSONAPI from 'jsonapi-typescript';
import { JsonApiModel } from '../models/jsonapi-model';
import { ModelType } from '../types/model-type';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';
import { request } from './http';
import { BulbThings } from '..';

export async function download<T extends JsonApiModel>(
    bulb: BulbThings,
    modelType: ModelType<T>,
    id: string
): Promise<any> {
    const endpoint = (Reflect.getMetadata(
        'JsonApiModelConfig',
        modelType
    ) as JsonApiModelConfig).endpoint;

    const res = await fetch(
        `${bulb.options.coreUrl}/${endpoint}/download/${id}`,
        {
            method: 'GET'
        }
    );

    return res;
}
