import { UiNode } from './ui-node';
import { EntityType } from '../models';

export interface EntityTypeUiNode extends UiNode {
    type: 'entityType';
    data: {
        entityType: EntityType;
        count?: number;
    };
}
