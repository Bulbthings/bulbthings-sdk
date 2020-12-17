import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { JsonApiModel } from './jsonapi-model';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Account } from './account';
import { Catalog } from './catalog';

@JsonApiModelConfig({
    endpoint: 'companies',
})
export class Company extends JsonApiModel<Company> {
    @Attribute()
    label: string;

    @Attribute()
    accountId?: string;

    @Attribute()
    catalogId?: string;

    @Attribute()
    avatarFileId?: string;

    @Attribute()
    meta?: {
        billingId?: string;
        /**
         * Array of paid features currently active for this company.
         */
        features?: string[];
    };

    @Attribute()
    createdAt?: Date;

    @Attribute()
    updatedAt?: Date;

    @Relation('BelongsTo', () => Account)
    account?: Account;

    @Relation('BelongsTo', () => Catalog)
    catalog?: Catalog;
}
