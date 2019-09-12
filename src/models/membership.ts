import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { JsonApiModel } from './jsonapi-model';
import { Account } from './account';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Company } from './company';
import { Period } from '../interfaces/period';
import { periodConverter } from '../converters/period';
import { Team } from './team';

@JsonApiModelConfig({
    endpoint: 'memberships'
})
export class Membership extends JsonApiModel {
    @Attribute()
    companyId: string;

    @Attribute()
    accountId: string;

    @Attribute()
    teamId: string;

    @Attribute({ converter: periodConverter })
    period: Period;

    @Attribute()
    isAdmin: boolean;

    @Relation('BelongsTo', () => Company)
    company?: Company;

    @Relation('BelongsTo', () => Account)
    account?: Account;

    @Relation('BelongsTo', () => Team)
    team?: Team;
}
