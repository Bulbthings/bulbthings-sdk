import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { JsonApiModel } from './jsonapi-model';
import { EntityType } from './entity-type';
import { File } from './file';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Company } from './company';
import { Account } from './account';

@JsonApiModelConfig({
    endpoint: 'entities'
})
export class Entity extends JsonApiModel<Entity> {
    @Attribute()
    companyId?: string;

    @Attribute()
    parentId?: string;

    @Attribute()
    entityTypeId: string;

    @Attribute()
    attributes?: {
        [name: string]: any;
    };

    @Attribute()
    accountId?: string;

    @Attribute()
    quantity?: number;

    @Relation('BelongsTo', () => Company)
    company?: Company;

    @Relation('BelongsTo', () => EntityType)
    entityType?: EntityType;

    @Relation('BelongsTo', () => Account)
    account?: Account;

    @Relation('HasMany', () => File)
    files?: File[];
}
