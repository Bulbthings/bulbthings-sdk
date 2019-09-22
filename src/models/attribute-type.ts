import { JsonApiModel } from './jsonapi-model';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Attribute } from '../decorators/attribute';
import { Relation } from '../decorators/relation';
import { EntityType } from './entity-type';
import { Unit } from './unit';
import { JsonSchema } from '../interfaces/json-schema';

@JsonApiModelConfig({
    endpoint: 'attributeTypes'
})
export class AttributeType extends JsonApiModel {
    @Attribute()
    companyId?: string;

    @Attribute()
    entityTypeId: string;

    @Attribute()
    jsonSchema: JsonSchema;

    @Attribute()
    unitId: string;

    @Attribute()
    timeSeriesOptions: object;

    @Relation('BelongsTo', () => EntityType)
    entityType?: EntityType;

    @Relation('BelongsTo', () => Unit)
    unit?: Unit;
}
