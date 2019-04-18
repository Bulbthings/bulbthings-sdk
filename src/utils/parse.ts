import * as JSONAPI from 'jsonapi-typescript';
import { JsonApiModel } from '../models/jsonapi-model';
import { ModelType } from '../types/model-type';
import { RelationAnnotation } from '../interfaces/relation-annotation';

export function parseResource<T extends JsonApiModel>(
    resource: JSONAPI.ResourceObject,
    type: ModelType<T>,
    includedResources: { [id: string]: JSONAPI.ResourceObject }
): T {
    // console.log('parse', resource, type);
    const model = new type(resource);
    // Parse 'Attribute' fields
    model.getAttributeMetadata().forEach(a => {
        if (model[a.propertyName] !== undefined && a.converter) {
            model[a.propertyName] = a.converter.parse(model[a.propertyName]);
        }
    });
    if (resource.relationships) {
        // Parse 'BelongsTo' relationships
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
                    // console.log('annotation', p);
                    model[p.propertyName] = parseResource(
                        includedResources[data.id],
                        p.type(),
                        includedResources
                    );
                }
            });
        // Parse 'HasMany' relationships
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
                model[p.propertyName] = data.map(d =>
                    parseResource(
                        includedResources[d.id],
                        p.type(),
                        includedResources
                    )
                );
            });
    }

    return model;
}
