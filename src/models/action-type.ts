import { JsonApiModel } from './jsonapi-model';
import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { EntityType } from './entity-type';
import { JsonSchema } from '../interfaces/json-schema';

@JsonApiModelConfig({
    endpoint: 'actionTypes'
})
export class ActionType extends JsonApiModel {
    @Attribute()
    schema: JsonSchema;

    @Attribute()
    entityTypeId?: string;

    @Relation('BelongsTo', () => EntityType)
    entityType?: EntityType;
}
