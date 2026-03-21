import { Include } from 'include';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { EntityType } from './entity-type';
import { JsonApiModel } from './jsonapi-model';

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
        /**
         * Category used to group together association types.
         */
        category?: string;
        /**
         * Stop the calculation of paths when reaching the target of this association type.
         */
        disablePathfinding?: boolean;
        /**
         * Whether or not this association type should be used as to display in calendars.
         */
        displayInCalendar?: boolean;
        /**
         * Whether or not this association type should be used to display relationship columns in
         * lists.
         */
        displayInList?: boolean;
        /**
         * Whether or not this association type should be used to display relationship columns in
         * lists.
         */
        displayInSourceList?: boolean;
        /**
         * Whether or not this association type should be used to display relationship columns in
         * lists.
         */
        displayInTargetList?: boolean;
        /**
         * Array of paid features required to use this type.
         */
        features?: string[];
        /**
         * Specifies if associations of this type are always bound to a period of time.
         */
        hasPeriod?: boolean;
        /**
         * Specifies if associations of this type can be quantified.
         */
        hasQuantity?: boolean;
        /**
         * Whether or not this association type should be used as a suggested relationship for the
         * source.
         */
        isImportantForSource?: boolean;
        /**
         * Whether or not this association type should be used as a suggested relationship for the
         * target.
         */
        isImportantForTarget?: boolean;
        /**
         * Whether or not the source should be considered and displayed as if it was part of the
         * target entity.
         */
        isSourcePartOfTarget?: boolean;
        /**
         * Label to be displayed when creating a new association for this type from the source
         * entity.
         */
        sourceActionLabel: string;
        /**
         * Label to use when displaying relationships from the source entity.
         */
        sourceSectionLabel?: string;
        sourceShouldBeCreated?: boolean;
        /**
         * Label to be displayed when creating a new association for this type from the target
         * entity.
         */
        targetActionLabel: string;
        /**
         * Label to use when displaying relationships from the target entity.
         */
        targetSectionLabel?: string;
        targetShouldBeCreated?: boolean;
    };

    @Relation('BelongsTo', () => EntityType)
    sourceEntityType?: Include<EntityType>;

    @Relation('BelongsTo', () => EntityType)
    targetEntityType?: Include<EntityType>;
}
