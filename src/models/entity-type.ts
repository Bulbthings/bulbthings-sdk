import { JsonApiModel } from './jsonapi-model';
import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { AttributeType } from './attribute-type';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { AssociationType } from './association-type';
import { EventType } from './event-type';
import { ActionType } from './action-type';

@JsonApiModelConfig({
    endpoint: 'entityTypes',
})
export class EntityType extends JsonApiModel<EntityType> {
    @Attribute()
    companyId?: string;

    @Attribute()
    parentId?: string;

    @Attribute()
    path?: string[];

    @Attribute()
    label: string;

    @Attribute()
    description?: string;

    @Attribute()
    meta?: {
        /**
         * Array of paid features required to use this entity type.
         */
        features?: string[];
        icon?: {
            fontAwesome?: string[] | string;
        };
        /**
         * Specifies if the type is abstract and should not be used to create entities.
         */
        isAbstract?: boolean;
        /**
         * Specifies if entities of this type should only be visible to their creator.
         */
        isPrivate?: boolean;
        /**
         * Specifies if entities of this type can be created on their own or are always created via
         * another type.
         */
        isRootType?: boolean;
    };

    @Relation('HasMany', () => AssociationType)
    associationTypes?: AssociationType[];

    @Relation('HasMany', () => AttributeType)
    attributeTypes?: AttributeType[];

    @Relation('HasMany', () => EventType)
    eventTypes?: EventType[];

    @Relation('HasMany', () => ActionType)
    actionTypes?: ActionType[];
}
