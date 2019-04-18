import * as JSONAPI from 'jsonapi-typescript';
import { JsonApiModel } from '../models/jsonapi-model';
import { ModelType } from '../types/model-type';

export function parseResource<T extends JsonApiModel>(
    resource: JSONAPI.ResourceObject,
    type: ModelType<T>,
    includedResources: { [id: string]: JSONAPI.ResourceObject }
): T {
    const model = new type(resource);
    // Parse 'Attribute' fields
    model.getMetadata('Attribute').forEach(a => {
        if (model[a.propertyName] !== undefined && a.converter) {
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
