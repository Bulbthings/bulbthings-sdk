import * as JSONAPI from 'jsonapi-typescript';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';
import { JsonApiModel } from '../models/jsonapi-model';
import { CacheResource } from '../resources/cache-resource';
import { ModelType } from '../types/model-type';

export function parseResource<T extends JsonApiModel<T>>(opts: {
    resource: JSONAPI.ResourceObject;
    type: ModelType<T>;
    includedResources?: {
        [type: string]: { [id: string]: JSONAPI.ResourceObject };
    };
    visitedModels?: { [type: string]: { [id: string]: any } };
    cache?: CacheResource;
}): T {
    const { resource, type, includedResources, visitedModels, cache } = {
        includedResources: {},
        visitedModels: {},
        ...opts,
    };

    // Build model from resource
    const model = new type(<any>{
        id: resource.id,
        ...resource.attributes,
    });

    // Keep track of visited resources to avoid infinite loops
    visitedModels[resource.type] = visitedModels[resource.type] || {};
    visitedModels[resource.type][model.id] = model;

    // Parse 'Attribute' fields
    model.getAttributeMetadata().forEach((a) => {
        if (model[a.propertyName] !== undefined && a.converter) {
            model[a.propertyName] = a.converter.parse(model[a.propertyName]);
        }
    });

    // Parse relationships
    if (resource.relationships) {
        // Parse 'BelongsTo'
        model
            .getRelationMetadata('BelongsTo')
            .filter((p) => resource.relationships[p.propertyName] !== undefined)
            .forEach((p) => {
                // Extract jsonapi resource
                const data = (
                    resource.relationships[
                        p.propertyName
                    ] as JSONAPI.RelationshipsWithData
                ).data as JSONAPI.ResourceIdentifierObject;
                if (data) {
                    // Recursively build the typed object
                    model[p.propertyName] =
                        (visitedModels[data.type] || {})[data.id] ||
                        parseResource({
                            resource: includedResources?.[data.type]?.[data.id],
                            type: p.type(),
                            includedResources,
                            visitedModels,
                            cache,
                        });
                }
            });
        // Parse 'HasMany'
        model
            .getRelationMetadata('HasMany')
            .filter((p) => resource.relationships[p.propertyName] !== undefined)
            .forEach((p) => {
                // Extract jsonapi resources
                const data = (
                    resource.relationships[
                        p.propertyName
                    ] as JSONAPI.RelationshipsWithData
                ).data as JSONAPI.ResourceIdentifierObject[];
                // Recursively build the typed objects
                model[p.propertyName] = data.map(
                    (d) =>
                        (visitedModels[d.type] || {})[d.id] ||
                        parseResource({
                            resource: includedResources?.[d.type]?.[d.id],
                            type: p.type(),
                            includedResources,
                            visitedModels,
                            cache,
                        })
                );
            });
    }

    // Cache resource
    const { endpoint } = Reflect.getMetadata(
        'JsonApiModelConfig',
        type
    ) as JsonApiModelConfig;

    if (endpoint && model?.id && opts.cache) {
        opts.cache.set(endpoint, model.id, model);
    }

    return model;
}
