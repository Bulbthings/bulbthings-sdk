import { JsonApiModel } from './jsonapi-model';
import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { EntityType } from './entity-type';
import { JsonSchema } from '../interfaces/json-schema';
import { Company } from './company';

@JsonApiModelConfig({
    endpoint: 'actionTypes',
})
export class ActionType extends JsonApiModel<ActionType> {
    @Attribute()
    companyId?: string;

    @Attribute()
    schema: JsonSchema;

    @Attribute()
    meta?: {
        /**
         * If true, the action should try to provide geoposition
         * coordinates as metadata when submitted.
         */
        useGeoPosition?: boolean;
    };

    @Relation('BelongsTo', () => Company)
    company?: Company;

    @Relation('HasMany', () => EntityType)
    entityTypes?: EntityType[];
}
