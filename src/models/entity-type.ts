import { JsonApiModel } from './jsonapi-model';
import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { AttributeType } from './attribute-type';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { AssociationType } from './association-type';
import { EventType } from './event-type';
import { ActionType } from './action-type';

@JsonApiModelConfig({
    endpoint: 'entityTypes'
})
export class EntityType extends JsonApiModel {
    @Attribute()
    companyId?: string;

    @Attribute()
    parentId?: string;

    @Attribute()
    path: string[];

    @Attribute()
    label: string;

    @Attribute()
    description: string;

    @Relation('HasMany', () => AttributeType)
    attributeTypes?: AttributeType[];

    @Relation('HasMany', () => AssociationType)
    associationTypes?: AssociationType[];

    @Relation('HasMany', () => EventType)
    eventTypes?: EventType[];

    @Relation('HasMany', () => ActionType)
    actionTypes?: ActionType[];
}
