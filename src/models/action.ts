import { JsonApiModel } from './jsonapi-model';
import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { ActionType } from './action-type';
import { Entity } from './entity';

@JsonApiModelConfig({
    endpoint: 'actions'
})
export class Action extends JsonApiModel {
    @Attribute()
    actionTypeId: string;

    @Attribute()
    sourceEntityId: string;

    @Attribute()
    targetEntityId: string;

    @Attribute()
    input: any;

    @Attribute()
    status?: 'available' | 'requested' | 'completed';

    @Attribute()
    requestedAt: Date;

    @Attribute()
    completedAt?: Date;

    @Relation('BelongsTo', () => ActionType)
    actionType?: ActionType;

    @Relation('BelongsTo', () => Entity)
    sourceEntity?: Entity;

    @Relation('BelongsTo', () => Entity)
    targetEntity?: Entity;
}
