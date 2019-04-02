import * as JSONAPI from 'jsonapi-typescript';
import { JsonApiOptions } from '../interfaces/json-api-options';
import { JsonApiModel } from '../models/jsonapi-model';
import { request } from '../utils/http';
import { ModelType } from '../types/model-type';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';
import BulbThings from '..';

function parseResource<T extends JsonApiModel>(
    resource: JSONAPI.ResourceObject,
    type: ModelType<T>,
    includedResources: { [id: string]: JSONAPI.ResourceObject }
): T {
    const model = new type(resource);
    // Parse 'Attribute' fields
    model.getMetadata('Attribute').forEach(a => {
        if (model[a.propertyName] && a.converter) {
            model[a.propertyName] = a.converter.parse(model[a.propertyName]);
        }
    });
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
        // Parse 'HasMany' relationships
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
    bulb: BulbThings,
    modelType: ModelType<T>,
    options?: JsonApiOptions
): Promise<{ meta?: any; data: T[] }> {
    const includedResources: { [id: string]: JSONAPI.ResourceObject } = {};
    const models: T[] = [];
    const endpoint = (Reflect.getMetadata(
        'JsonApiModelConfig',
        modelType
    ) as JsonApiModelConfig).endpoint;

    const res = await request('GET', `${bulb.basePath}/${endpoint}`, {
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
    bulb: BulbThings,
    modelType: ModelType<T>,
    id: string,
    options?: JsonApiOptions
): Promise<T> {
    const includedResources: { [id: string]: JSONAPI.ResourceObject } = {};
    const endpoint = (Reflect.getMetadata(
        'JsonApiModelConfig',
        modelType
    ) as JsonApiModelConfig).endpoint;

    const res = await request('GET', `${bulb.basePath}/${endpoint}/${id}`, {
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
