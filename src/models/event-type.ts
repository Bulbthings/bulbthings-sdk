import { JsonApiModel } from './jsonapi-model';
import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { AttributeType } from './attribute-type';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { AssociationType } from './association-type';
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
