import { JsonApiModel } from './jsonapi-model';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Attribute } from '../decorators/attribute';
import { Relation } from '../decorators/relation';
import { EntityType } from './entity-type';

@JsonApiModelConfig({
    endpoint: 'associationTypes',
})
export class AssociationType extends JsonApiModel<AssociationType> {
    @Attribute()
    companyId?: string;

    @Attribute()
    sourceEntityTypeId: string;

    @Attribute()
    targetEntityTypeId: string;

    @Attribute()
    sourceIsShared: boolean;

    @Attribute()
    targetIsShared: boolean;

    @Attribute()
    meta: {
        category?: string;
        displayInCalendar?: boolean;
        displayInList?: boolean;
        hasPeriod?: boolean;
        hasQuantity?: boolean;
        isImportantForSource?: boolean;
        isImportantForTarget?: boolean;
        isSourcePartOfTarget?: boolean;
        sourceActionLabel: string;
        sourceSectionLabel?: string;
        sourceShouldBeCreated?: boolean;
        targetActionLabel: string;
        targetSectionLabel?: string;
        targetShouldBeCreated?: boolean;
    };

    @Relation('BelongsTo', () => EntityType)
    sourceEntityType?: EntityType;

    @Relation('BelongsTo', () => EntityType)
    targetEntityType?: EntityType;
}
