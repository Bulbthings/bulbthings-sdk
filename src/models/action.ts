import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { Include } from '../types/include';
import { Account } from './account';
import { ActionType } from './action-type';
import { Company } from './company';
import { Entity } from './entity';
import { JsonApiModel } from './jsonapi-model';

@JsonApiModelConfig({
    endpoint: 'actions',
})
export class Action extends JsonApiModel<Action> {
    @Attribute()
    companyId?: string;

    @Attribute()
    actionTypeId: string;

    @Attribute()
    accountId?: string;

    @Attribute()
    entityId?: string;

    @Attribute()
    input: any;

    @Attribute()
    label?: string;

    @Attribute()
    status?: 'available' | 'requested' | 'completed';

    @Attribute()
    requestedAt?: Date;

    @Attribute()
    completedAt?: Date;

    @Attribute()
    meta?: {
        geoPosition?: {
            lat: number;
            lng: number;
            elevation?: number;
        };
        /**
         * True if the action originated from an unauthenticated user
         */
        isPublic?: boolean;
        timezone?: string;
    };

    @Relation('BelongsTo', () => Company)
    company?: Include<Company>;

    @Relation('BelongsTo', () => ActionType)
    actionType?: Include<ActionType>;

    @Relation('BelongsTo', () => Account)
    account?: Include<Account>;

    @Relation('BelongsTo', () => Entity)
    entity?: Include<Entity>;
}
