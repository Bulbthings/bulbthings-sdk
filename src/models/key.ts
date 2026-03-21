import { Include } from 'include';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { Account } from './account';
import { JsonApiModel } from './jsonapi-model';

@JsonApiModelConfig({
    endpoint: 'keys',
})
export class Key extends JsonApiModel<Key> {
    @Attribute()
    accountId?: string;

    @Attribute()
    label?: string;

    @Attribute()
    type?: 'login' | 'api' | 'email';

    @Attribute()
    value?: string;

    @Attribute()
    hash?: string;

    @Attribute()
    meta?: {
        ip?: string;
        userAgent?: string;
        browser?: {
            name?: string;
            version?: string;
        };
        os?: {
            name?: string;
            version?: string;
        };
    };

    @Attribute()
    expiresAt?: Date;

    @Attribute()
    createdAt?: Date;

    @Attribute()
    updatedAt?: Date;

    @Relation('BelongsTo', () => Account)
    account?: Include<Account>;
}
