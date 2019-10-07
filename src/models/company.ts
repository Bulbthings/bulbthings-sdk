import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { JsonApiModel } from './jsonapi-model';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Account } from './account';

@JsonApiModelConfig({
    endpoint: 'companies'
})
export class Company extends JsonApiModel<Company> {
    @Attribute()
    label: string;

    @Attribute()
    accountId?: string;

    @Attribute()
    createdAt?: Date;

    @Attribute()
    updatedAt?: Date;

    @Relation('BelongsTo', () => Account)
    account?: Account;
}
