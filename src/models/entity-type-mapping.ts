import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { Include } from '../types/include';
import { ActionType } from './action-type';
import { AssociationType } from './association-type';
import { AttributeType } from './attribute-type';
import { EntityType } from './entity-type';
import { EventType } from './event-type';
import { JsonApiModel } from './jsonapi-model';
import { Role } from './role';

@JsonApiModelConfig({ endpoint: 'entityTypeMappings' })
export class EntityTypeMapping extends JsonApiModel<EntityTypeMapping> {
    @Attribute()
    actionTypeId?: string;

    @Attribute()
    associationTypeId?: string;

    @Attribute()
    attributeTypeId?: string;

    @Attribute()
    companyId?: string;

    @Attribute()
    entityId?: string;

    @Attribute()
    entityTypeId: string;

    @Attribute()
    eventTypeId?: string;

    @Attribute()
    isInherited?: boolean;

    @Attribute()
    meta?: {
        displayInPreview?: boolean;
        excludedCompanies?: string[];
        isHidden?: boolean;
        isImportant?: boolean;
        isPublic?: boolean;
        isReadOnly?: boolean;
        isRequired?: boolean;
        /**
         * System mappings are generated automatically for association types and cannot be edited.
         */
        isSystem?: boolean;
        order?: number;
    };

    @Attribute()
    privateForAccountId?: string;

    @Attribute()
    roleId?: string;

    @Attribute()
    type: 'associationType' | 'attributeType' | 'eventType' | 'actionType';

    @Relation('BelongsTo', () => EntityType)
    entityType?: Include<EntityType>;

    @Relation('BelongsTo', () => AssociationType)
    associationType?: Include<AssociationType>;

    @Relation('BelongsTo', () => AttributeType)
    attributeType?: Include<AttributeType>;

    @Relation('BelongsTo', () => EventType)
    eventType?: Include<EventType>;

    @Relation('BelongsTo', () => ActionType)
    actionType?: Include<ActionType>;

    @Relation('BelongsTo', () => Role)
    role?: Include<Role>;
}
