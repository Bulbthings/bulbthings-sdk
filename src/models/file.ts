import { JsonApiModel } from './jsonapi-model';
import { Attribute } from '../decorators/attribute';
import { Relation } from '../decorators/relation';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Entity } from './entity';
import { Company } from './company';
import { Account } from './account';

@JsonApiModelConfig({
    endpoint: 'files'
})
export class File extends JsonApiModel {
    @Attribute()
    companyId: string;

    @Attribute()
    parentFileId?: string;

    @Attribute()
    accountId: string;

    @Attribute()
    entityId: string;

    @Attribute()
    name: string;

    @Attribute()
    isFolder: boolean;

    @Attribute()
    storeId?: string;

    @Attribute()
    meta: any;

    @Relation('BelongsTo', () => Company)
    company?: Company;

    @Relation('BelongsTo', () => Account)
    account?: Account;

    @Relation('BelongsTo', () => Entity)
    entity?: Entity;
}
