import { BelongsTo } from '../decorators/belongs-to';
import { JsonApiModel } from './jsonapi-model';
import { EntityType } from './entity-type';
import { JsonApiModelConfig } from '../decorators/json-api-model';

@JsonApiModelConfig({
    endpoint: 'entities'
})
export class Entity extends JsonApiModel {
    // @Attribute()
    parentId: string;

    // @Attribute()
    entityTypeId: string;

    // @Attribute()
    attributes: object;

    // @Attribute()
    quantity: number;

    @BelongsTo()
    entitytype: EntityType;
}
