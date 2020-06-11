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
export class File extends JsonApiModel<File> {
    @Attribute()
    companyId?: string;

    @Attribute()
    parentFileId?: string;

    @Attribute()
    isFolder?: boolean;

    @Attribute()
    name: string;

    @Attribute()
    size?: number;

    @Attribute()
    type?: string;

    @Attribute()
    encoding?: string;

    @Attribute()
    accountId?: string;

    @Attribute()
    entityId?: string;

    @Attribute()
    createdAt?: Date;

    @Attribute()
    updatedAt?: Date;

    @Relation('BelongsTo', () => Company)
    company?: Company;

    @Relation('BelongsTo', () => Account)
    account?: Account;

    @Relation('BelongsTo', () => Entity)
    entity?: Entity;
}
