import * as JSONAPI from 'jsonapi-typescript';
import { JsonApiModel } from '../models/jsonapi-model';
import { ModelType } from '../types/model-type';

export function parseResource<T extends JsonApiModel>(
    resource: JSONAPI.ResourceObject,
    type: ModelType<T>,
    includedResources: { [id: string]: JSONAPI.ResourceObject },
    visitedResources: { [type: string]: { [id: string]: any } } = {}
): T {
    // Build model from resource
    const model = new type(resource);

    // Keep track of visited resources to avoid infinite loops
    visitedResources[resource.type] = visitedResources[resource.type] || {};
    visitedResources[resource.type][model.id] = model;

    // Parse 'Attribute' fields
    model.getAttributeMetadata().forEach(a => {
        if (model[a.propertyName] !== undefined && a.converter) {
            model[a.propertyName] = a.converter.parse(model[a.propertyName]);
        }
    });

    // Parse relationships
    if (resource.relationships) {
        // Parse 'BelongsTo'
        model
            .getRelationMetadata('BelongsTo')
            .filter(p => resource.relationships[p.propertyName] !== undefined)
            .forEach(p => {
                // Extract jsonapi resource
                const data = (resource.relationships[
                    p.propertyName
                ] as JSONAPI.RelationshipsWithData)
                    .data as JSONAPI.ResourceIdentifierObject;
                if (data) {
                    // Recursively build the typed object
                    model[p.propertyName] =
                        (visitedResources[data.type] || {})[data.id] ||
                        parseResource(
                            includedResources[data.id],
                            p.type(),
                            includedResources,
                            visitedResources
                        );
                }
            });
        // Parse 'HasMany'
        model
            .getRelationMetadata('HasMany')
            .filter(p => resource.relationships[p.propertyName] !== undefined)
            .forEach(p => {
                // Extract jsonapi resources
                const data = (resource.relationships[
                    p.propertyName
                ] as JSONAPI.RelationshipsWithData)
                    .data as JSONAPI.ResourceIdentifierObject[];
                // Recursively build the typed objects
                model[p.propertyName] = data.map(
                    d =>
                        (visitedResources[d.type] || {})[d.id] ||
                        parseResource(
                            includedResources[d.id],
                            p.type(),
                            includedResources,
                            visitedResources
                        )
                );
            });
    }

    return model;
}
