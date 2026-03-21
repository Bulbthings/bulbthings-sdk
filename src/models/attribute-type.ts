import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { JsonSchema } from '../interfaces/json-schema';
import { Include } from '../types/include';
import { EntityType } from './entity-type';
import { JsonApiModel } from './jsonapi-model';
import { Unit } from './unit';

@JsonApiModelConfig({
    endpoint: 'attributeTypes',
})
export class AttributeType extends JsonApiModel<AttributeType> {
    @Attribute()
    companyId?: string;

    @Attribute()
    schema: JsonSchema;

    @Attribute()
    unitId?: string;

    @Attribute()
    timeSeriesOptions?: object;

    @Attribute()
    isReadOnly?: boolean;

    @Attribute()
    meta?: {
        defaultUnits?: {
            britishImperial?: string;
        };
        display?: {
            icon?: {
                fontAwesome?: string[] | string;
            };
            numberFormat?: {
                maximumFractionDigits?: number;
                minimumFractionDigits?: number;
            };
            ranges?: {
                displayValue?: any;
                schema?: JsonSchema;
                style?: {
                    backgroundColor?: string;
                    color?: string;
                };
            }[];
            style?: {
                backgroundColor?: string;
                color?: string;
            };
        };
        /**
         * Array of paid features required to use this type.
         */
        features?: string[];
    };

    @Relation('HasMany', () => EntityType)
    entityTypes?: Include<EntityType[]>;

    @Relation('BelongsTo', () => Unit)
    unit?: Include<Unit>;
}
