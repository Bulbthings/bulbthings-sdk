import { JsonApiModel } from './jsonapi-model';
import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { EntityType } from './entity-type';

@JsonApiModelConfig({
    endpoint: 'eventTypes'
})
export class EventType extends JsonApiModel {
    @Attribute()
    entityTypeId?: string;

    @Attribute()
    isSystem: boolean;

    @Attribute()
    schema: object;

    @Relation('BelongsTo', () => EntityType)
    entityType: EntityType;
}
