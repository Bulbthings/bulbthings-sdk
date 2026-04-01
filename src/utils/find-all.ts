import * as JSONAPI from 'jsonapi-typescript';
import { Bulbthings } from '..';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';
import { JsonApiOptions } from '../interfaces/json-api-options';
import { JsonApiModel } from '../models/jsonapi-model';
import { ModelType } from '../types/model-type';
import { request } from './http';
import { parseResource } from './parse';

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

    let autoPage = false;
    let offset = options?.page?.offset || 0;
    let limit = options?.page?.limit || 100;
    let page = 0;
    let start: number;
    let res: JSONAPI.CollectionResourceDoc & { meta: any };

    while (!page || (autoPage && models.length < res?.meta?.rowCount - start)) {
        res = await request(
            bulb,
            'GET',
            `${bulb.options.coreUrl}/${endpoint}`,
            { params: { ...options, page: { offset, limit } } }
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
        offset = res.meta.offset + res.meta.limit;
        limit = res.meta.limit;
        page++;

        if (page === 1) {
            start = res.meta.offset;
            autoPage =
                options?.page?.limit === undefined ||
                options?.page?.limit > limit;
        }

        console.log(`[bulbthings][findAll][${endpoint}]`, {
            models: models.length,
            ...res.meta,
            autoPage,
            page,
        });
    }

    return {
        meta: autoPage
            ? { ...res.meta, offset: start, limit: limit * page }
            : { ...res.meta },
        data: models,
    };
}
