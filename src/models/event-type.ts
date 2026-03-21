import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { JsonSchema } from '../interfaces/json-schema';
import { EntityType } from './entity-type';
import { JsonApiModel } from './jsonapi-model';

@JsonApiModelConfig({
    endpoint: 'eventTypes',
})
export class EventType extends JsonApiModel<EventType> {
    @Attribute()
    companyId?: string;

    @Attribute()
    schema: JsonSchema;

    @Attribute()
    meta?: {
        /**
         * Whether or not events of this type are intended to represent long-running operations and
         * should be displayed accordingly until completion.
         */
        isProgress?: boolean;
        /**
         * Whether or not events of this type should be hidden from end users.
         */
        isSystem?: boolean;
    };

    @Relation('HasMany', () => EntityType)
    entityTypes?: EntityType[];
}
