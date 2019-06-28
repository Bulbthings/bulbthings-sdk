import { JsonApiModel } from './jsonapi-model';
import { Attribute } from '../decorators/attribute';
import { Relation } from '../decorators/relation';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Entity } from './entity';

@JsonApiModelConfig({
    endpoint: 'files'
})
export class File extends JsonApiModel {
    @Attribute()
    parentFileId?: string;

    @Attribute()
    sourceEntityId: string;

    @Attribute()
    targetEntityId: string;

    @Attribute()
    name: string;

    @Attribute()
    isFolder: boolean;

    @Attribute()
    storeId?: string;

    @Attribute()
    meta: any;

    @Relation('BelongsTo', () => Entity)
    sourceEntity?: Entity;

    @Relation('BelongsTo', () => Entity)
    targetEntity?: Entity;
}
