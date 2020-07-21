import { UiNode } from './ui-node';
import { Entity } from '../../models';

export interface EntityUiNode extends UiNode {
    type: 'entity';
    data: {
        entity: Entity;
        count?: number;
    };
}
