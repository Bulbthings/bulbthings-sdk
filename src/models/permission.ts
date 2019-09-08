import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { JsonApiModel } from './jsonapi-model';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Company } from './company';
import { Team } from './team';

@JsonApiModelConfig({
    endpoint: 'permissions'
})
export class Permission extends JsonApiModel {
    @Attribute()
    companyId: string;

    @Attribute()
    teamId: string;

    @Attribute()
    resource: string;

    @Attribute()
    filter: any;

    @Attribute()
    rights: string[];

    @Relation('BelongsTo', () => Company)
    company?: Company;

    @Relation('BelongsTo', () => Team)
    team?: Team;
}
