import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { JsonSchema } from '../interfaces/json-schema';
import { Include } from '../types/include';
import { Company } from './company';
import { EntityType } from './entity-type';
import { JsonApiModel } from './jsonapi-model';

@JsonApiModelConfig({ endpoint: 'actionTypes' })
export class ActionType extends JsonApiModel<ActionType> {
    @Attribute()
    companyId?: string;

    @Attribute()
    schema: JsonSchema;

    @Attribute()
    meta?: {
        /**
         * Array of paid features required to use this type.
         */
        features?: string[];
        /**
         * If provided, the action will open the corresponding front-end component.
         */
        redirectTo?: {
            routeId: 'entityCreation';
            routeParams?: {
                associationTypes?: string[];
                entityTypes?: string[];
                isSource?: boolean;
            };
        };
        /**
         * If true, the action will only be available when scanning the associated entity.
         */
        requireScan?: boolean;
        /**
         * If true, the action should try to provide geoposition coordinates as metadata when
         * submitted.
         */
        useGeoPosition?: boolean;
    };

    @Relation('BelongsTo', () => Company)
    company?: Include<Company>;

    @Relation('HasMany', () => EntityType)
    entityTypes?: Include<EntityType[]>;
}
