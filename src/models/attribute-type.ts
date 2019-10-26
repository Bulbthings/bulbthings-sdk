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
export class AttributeType extends JsonApiModel<AttributeType> {
    @Attribute()
    companyId?: string;

    @Attribute()
    schema: JsonSchema;

    @Attribute()
    unitId?: string;

    @Attribute()
    timeSeriesOptions: object;

    @Attribute()
    isReadOnly: boolean;

    @Relation('HasMany', () => EntityType)
    entityTypes?: EntityType[];

    @Relation('BelongsTo', () => Unit)
    unit?: Unit;
}
