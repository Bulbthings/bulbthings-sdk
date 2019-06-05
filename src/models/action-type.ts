import { JsonApiModel } from './jsonapi-model';
import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { EntityType } from './entity-type';

@JsonApiModelConfig({
    endpoint: 'actionTypes'
})
export class ActionType extends JsonApiModel {
    @Attribute()
    schema: object;

    @Attribute()
    entityTypeId?: string;

    @Relation('BelongsTo', () => EntityType)
    entityType?: EntityType;
}
