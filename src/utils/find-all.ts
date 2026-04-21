import * as JSONAPI from 'jsonapi-typescript';
import { Bulbthings } from '..';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';
import { JsonApiOptions } from '../interfaces/json-api-options';
import { JsonApiModel } from '../models/jsonapi-model';
import { ModelType } from '../types/model-type';
import { request } from './http';
import { parseResource } from './parse';

const param = (value: any) => (value === Infinity ? undefined : value);

export async function findAll<T extends JsonApiModel<T>>(
    bulb: Bulbthings,
    modelType: ModelType<T>,
    options?: JsonApiOptions
): Promise<{ meta?: any; data: T[] }> {
    const models: T[] = [];
    const { endpoint } = Reflect.getMetadata(
        'JsonApiModelConfig',
        modelType
    ) as JsonApiModelConfig;

    let offset = options?.page?.offset;
    let limit = options?.page?.limit ?? Infinity;
    let start: number;
    let remainingRows = 0;
    let res: JSONAPI.CollectionResourceDoc & { meta?: any };

    while (start === undefined || remainingRows) {
        res = await request(
            bulb,
            'GET',
            `${bulb.options.coreUrl}/${endpoint}`,
            { params: { ...options, page: { offset, limit: param(limit) } } }
        );

        // Build a map of included resources by id for fast access
        const includedResources: {
            [type: string]: { [id: string]: JSONAPI.ResourceObject };
        } = {};
        (res.included || []).forEach((r) => {
            includedResources[r.type] = includedResources[r.type] || {};
            includedResources[r.type][r.id] = r;
        });

        // Parse the data and build relationships
        (res.data || []).forEach((element) => {
            const model = parseResource({
                resource: element,
                type: modelType,
                includedResources,
                cache: !options?.fields ? bulb.cache : null,
            });
            models.push(model);
        });

        // Update pagination values
        start = start ?? res.meta?.offset ?? 0;
        offset = (res.meta?.offset ?? 0) + (res.data?.length || 0);
        // TODO: if limit is negative
        limit = limit - (res.data?.length || 0);
        remainingRows = res.meta?.rowCount
            ? Math.min(res.meta.rowCount - start - models.length, limit)
            : 0;

        console.log(`[bulbthings][findAll][${endpoint}]`, {
            ...res.meta,
            models: models.length,
            remainingRows,
            next: { offset, limit },
        });
    }

    return {
        meta: {
            ...res.meta,
            offset: start,
            limit: options?.page?.limit ?? models.length,
        },
        data: models,
    };
}
