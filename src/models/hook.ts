import { JsonApiModel } from './jsonapi-model';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { Company } from './company';

@JsonApiModelConfig({
    endpoint: 'hooks'
})
export class Hook extends JsonApiModel {
    @Attribute()
    companyId: string;

    @Attribute()
    isActive: boolean;

    @Attribute()
    name: string;

    @Attribute()
    url?: string;

    @Attribute()
    script?: string;

    @Attribute()
    triggeredOn: string[];

    @Relation('BelongsTo', () => Company)
    company?: Company;
}
