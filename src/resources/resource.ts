import * as JSONAPI from 'jsonapi-typescript';
import { JsonApiOptions } from '../interfaces/json-api-options';
import { JsonApiModel } from '../models/jsonapi-model';
import { request } from '../utils/http';
import { ModelType } from '../types/model-type';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';

const base = 'https://core-v2.bulbthings.com';

function parseResource<T extends JsonApiModel>(
    resource: JSONAPI.ResourceObject,
    type: ModelType<T>,
    includedResources: { [id: string]: JSONAPI.ResourceObject }
): T {
    const model = new type(resource);
    if (resource.relationships) {
        // Parse 'BelongsTo' relationships
        model
            .getMetadata('BelongsTo')
            .filter(p => resource.relationships[p.propertyName] !== undefined)
            .forEach(p => {
                // Extract jsonapi resource
                const data = (resource.relationships[
                    p.propertyName
                ] as JSONAPI.RelationshipsWithData)
                    .data as JSONAPI.ResourceIdentifierObject;
                if (data) {
                    // Recursively build the typed object
                    model[p.propertyName] = parseResource(
                        includedResources[data.id],
                        p.type,
                        includedResources
                    );
                }
            });
        // parse HasMany
        model
            .getMetadata('HasMany')
            .filter(p => resource.relationships[p.propertyName] !== undefined)
            .forEach(p => {
                // Extract jsonapi resources
                const data = (resource.relationships[
                    p.propertyName
                ] as JSONAPI.RelationshipsWithData)
                    .data as JSONAPI.ResourceIdentifierObject[];
                // Recursively build the typed objects
                model[p.propertyName] = data.map(d =>
                    parseResource(
                        includedResources[d.id],
                        p.type,
                        includedResources
                    )
                );
            });
    }

    return model;
}

async function findAll<T extends JsonApiModel>(
    modelType: ModelType<T>,
    options?: JsonApiOptions
): Promise<{ meta?: any; data: T[] }> {
    const includedResources: { [id: string]: JSONAPI.ResourceObject } = {};
    const models: T[] = [];
    const endpoint = (Reflect.getMetadata(
        'JsonApiModelConfig',
        modelType
    ) as JsonApiModelConfig).endpoint;

    const res = await request('GET', `${base}/${endpoint}`, {
        params: options
    });

    // Build a map of included resources by id for fast access
    ((res as JSONAPI.CollectionResourceDoc).included || []).forEach(
        r => (includedResources[r.id] = r)
    );

    // Parse the data and build relationships
    (res as JSONAPI.CollectionResourceDoc).data.forEach(element => {
        const model = parseResource(element, modelType, includedResources);
        models.push(model);
    });

    return { meta: res.meta || {}, data: models };
}

async function findById<T extends JsonApiModel>(
    modelType: ModelType<T>,
    id: string,
    options?: JsonApiOptions
): Promise<T> {
    const includedResources: { [id: string]: JSONAPI.ResourceObject } = {};
    const endpoint = (Reflect.getMetadata(
        'JsonApiModelConfig',
        modelType
    ) as JsonApiModelConfig).endpoint;

    const res = await request('GET', `${base}/${endpoint}/${id}`, {
        params: options
    });

    // Build a map of included resources by id for fast access
    ((res as JSONAPI.SingleResourceDoc).included || []).forEach(
        r => (includedResources[r.id] = r)
    );

    const model = parseResource(
        (res as JSONAPI.SingleResourceDoc).data,
        modelType,
        includedResources
    );

    return model;
}

export class Resource<T extends JsonApiModel> {
    constructor(private modelType: ModelType<T>) {}

    async findAll(options?: JsonApiOptions) {
        return findAll(this.modelType, options);
    }

    async findById(id: string, options?: JsonApiOptions) {
        return findById(this.modelType, id, options);
    }
}
