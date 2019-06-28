import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { JsonApiModel } from './jsonapi-model';
import { EntityType } from './entity-type';
import { File } from './file';
import { JsonApiModelConfig } from '../decorators/json-api-model';

@JsonApiModelConfig({
    endpoint: 'entities'
})
export class Entity extends JsonApiModel {
    @Attribute()
    parentId: string;

    @Attribute()
    entityTypeId: string;

    @Attribute()
    attributes: {
        [name: string]: any;
    };

    @Attribute()
    quantity: number;

    @Relation('BelongsTo', () => EntityType)
    entitytype?: EntityType;

    @Relation('HasMany', () => File)
    files?: File[];
}
