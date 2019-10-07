import { JsonApiModel } from './jsonapi-model';
import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { EntityType } from './entity-type';
import { JsonSchema } from '../interfaces/json-schema';

@JsonApiModelConfig({
    endpoint: 'eventTypes'
})
export class EventType extends JsonApiModel<EventType> {
    @Attribute()
    companyId?: string;

    @Attribute()
    schema: JsonSchema;

    @Attribute()
    isSystem?: boolean;

    @Relation('HasMany', () => EntityType)
    entityTypes?: EntityType[];
}
