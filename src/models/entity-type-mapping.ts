import { JsonApiModel } from './jsonapi-model';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Attribute } from '../decorators/attribute';
import { Relation } from '../decorators/relation';
import { EntityType } from './entity-type';
import { AssociationType } from './association-type';
import { AttributeType } from './attribute-type';
import { EventType } from './event-type';
import { ActionType } from './action-type';

@JsonApiModelConfig({
    endpoint: 'entityTypeMappings'
})
export class EntityTypeMapping extends JsonApiModel {
    @Attribute()
    companyId?: string;

    @Attribute()
    entityTypeId: string;

    @Attribute()
    type: 'associationType' | 'attributeType' | 'eventType' | 'actionType';

    @Attribute()
    associationTypeId?: string;

    @Attribute()
    attributeTypeId?: string;

    @Attribute()
    eventTypeId?: string;

    @Attribute()
    actionTypeId?: string;

    @Attribute()
    isInherited: boolean;

    @Relation('BelongsTo', () => EntityType)
    entityType?: EntityType;

    @Relation('BelongsTo', () => AssociationType)
    associationType?: AssociationType;

    @Relation('BelongsTo', () => AttributeType)
    attributeType?: AttributeType;

    @Relation('BelongsTo', () => EventType)
    eventType?: EventType;

    @Relation('BelongsTo', () => ActionType)
    actionType?: ActionType;
}
