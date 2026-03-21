import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { Include } from '../types/include';
import { Account } from './account';
import { Catalog } from './catalog';
import { JsonApiModel } from './jsonapi-model';

@JsonApiModelConfig({
    endpoint: 'companies',
})
export class Company extends JsonApiModel<Company> {
    /**
     * Identifier of the company's owner account.
     */
    @Attribute()
    accountId?: string;

    /**
     * Identifier of the image file object used as the profile picture of the company.
     */
    @Attribute()
    avatarFileId?: string;

    /**
     * Identifier of the company's active catalog.
     */
    @Attribute()
    catalogId?: string;

    /**
     * Time at which the account was created.
     */
    @Attribute()
    createdAt?: Date;

    /**
     * Full name of the company.
     */
    @Attribute()
    label: string;

    /**
     * Language code of the company as defined in [BCP
     * 47](https://en.wikipedia.org/wiki/IETF_language_tag)
     */
    @Attribute()
    locale?: null | string;

    @Attribute()
    meta?: {
        billingId?: string;
        /**
         * Array of paid features currently active for this company.
         */
        features?: string[];
    };

    /**
     * Time at which the account was last updated.
     */
    @Attribute()
    updatedAt?: Date;

    @Relation('BelongsTo', () => Account)
    account?: Include<Account>;

    @Relation('BelongsTo', () => Catalog)
    catalog?: Include<Catalog>;
}
