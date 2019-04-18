import { JsonApiModel } from './jsonapi-model';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Attribute } from '../decorators/attribute';
import { Relation } from '../decorators/relation';
import { EntityType } from './entity-type';
import { Unit } from './unit';

@JsonApiModelConfig({
    endpoint: 'attributetypes'
})
export class AttributeType extends JsonApiModel {
    @Attribute()
    entityTypeId: string;

    @Attribute()
    name: string;

    @Attribute()
    jsonSchema: {
        title: string;
        category: string;
        description: string;
        type?:
            | 'string'
            | 'integer'
            | 'number'
            | 'object'
            | 'array'
            | 'boolean'
            | 'null';
        default?: any;
        format?: 'date-time' | 'time' | 'date';
    };

    @Attribute()
    unitId: string;

    @Attribute()
    timeSeriesOptions: object;

    @Relation('BelongsTo', () => EntityType)
    entitytype: EntityType;

    @Relation('BelongsTo', () => Unit)
    unit?: Unit;
}
