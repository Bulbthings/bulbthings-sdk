import { JsonApiModel } from './jsonapi-model';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Attribute } from '../decorators/attribute';
import { Relation } from '../decorators/relation';
import { EntityType } from './entity-type';
import { AssociationType } from './association-type';
import { AttributeType } from './attribute-type';
import { EventType } from './event-type';
import { ActionType } from './action-type';
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
    entityTypeId: string;

    @Attribute()
    eventTypeId?: string;

    @Attribute()
    isInherited?: boolean;

    @Attribute()
    meta?: {
        displayInPreview?: boolean;
        excludedCompanies?: string[];
        isImportant?: boolean;
        isPublic?: boolean;
        isReadOnly?: boolean;
        isRequired?: boolean;
        order?: number;
    };

    @Attribute()
    roleId?: string;

    @Attribute()
    type: 'associationType' | 'attributeType' | 'eventType' | 'actionType';

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

    @Relation('BelongsTo', () => Role)
    role?: Role;
}
