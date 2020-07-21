import { UiNode } from './ui-node';
import { ActionType } from '../../models';
import { Entity } from '../../models';

export interface ActionTypeUiNode extends UiNode {
    type: 'actionType';
    data: {
        actionType: ActionType;
        entity?: Entity;
    };
}
