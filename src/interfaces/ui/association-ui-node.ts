import { UiNode } from './ui-node';
import { Association } from '../../models';

export interface AssociationUiNode extends UiNode {
    type: 'association';
    data: {
        isSource: boolean;
        association: Association;
    };
}
