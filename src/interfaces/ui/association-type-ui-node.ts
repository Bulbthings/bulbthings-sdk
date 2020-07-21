import { UiNode } from './ui-node';
import { AssociationType } from '../../models';
import { Entity } from '../../models';

export interface AssociationTypeUiNode extends UiNode {
    type: 'associationType';
    data: {
        isSource: boolean;
        associationType: AssociationType;
        entity?: Entity;
    };
}
