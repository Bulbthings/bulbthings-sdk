import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { Account } from './account';
import { Company } from './company';
import { JsonApiModel } from './jsonapi-model';
import { SettingType } from './setting-type';

@JsonApiModelConfig({
    endpoint: 'settings',
})
export class Setting extends JsonApiModel<Setting> {
    @Attribute()
    companyId?: string;

    @Attribute()
    accountId?: string;

    @Attribute()
    settingTypeId: string;

    @Attribute()
    value: any;

    @Relation('BelongsTo', () => Company)
    company?: Company;

    @Relation('BelongsTo', () => Account)
    account?: Account;

    @Relation('BelongsTo', () => SettingType)
    settingType?: SettingType;
}
