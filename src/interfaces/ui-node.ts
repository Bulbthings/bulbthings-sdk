import { TemplateRef } from '@angular/core';

export interface UiNode {
    label: string | null;
    type?: string;
    id?: string;
    icon?: string;
    data?: any;
    children?: UiNode[];
    parents?: UiNode[];
    callback?: ({ event: MouseEvent, item: UiNode }) => void;
    isDivider?: boolean;
    isSelected?: boolean;
    fetchChildren?: (
        item: UiNode,
        params?: { offset: number; limit: number; sort: string[] }
    ) => Promise<{ data: UiNode[]; total: number }>;
    /**
     * Pagination limit to use with fetchChildren()
     */
    fetchChildrenLimit?: number;
    /**
     * Read-only field, automatically set when fetching children using fetchChildren()
     */
    fetchChildrenTotal?: number;
    actions?: UiNode[];
    template?: TemplateRef<any>;
    /**
     * Whether or not to translate the `name` property
     */
    translate?: boolean;
}
