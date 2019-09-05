import { JsonApiModel } from './jsonapi-model';
import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Company } from './company';
import { Account } from './account';

@JsonApiModelConfig({
    endpoint: 'keys'
})
export class Key extends JsonApiModel {
    @Attribute()
    companyId: string;

    @Attribute()
    accountId: string;

    @Attribute()
    label?: string;

    @Attribute()
    type: 'login' | 'api' | 'email';

    @Attribute()
    value?: string;

    @Attribute()
    hash: string;

    @Attribute()
    expiresAt: Date;

    @Attribute()
    createdAt: Date;

    @Attribute()
    updatedAt: Date;

    @Relation('BelongsTo', () => Company)
    company?: Company;

    @Relation('BelongsTo', () => Account)
    account?: Account;
}
