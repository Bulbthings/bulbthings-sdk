export interface UINode {
    label: string | null;
    type?: string;
    id?: string;
    icon?: string;
    data?: any;
    children?: UINode[];
    parents?: UINode[];
    callback?: (data: { event: MouseEvent; item: UINode }) => void;
    isDivider?: boolean;
    isSelected?: boolean;
    fetchChildren?: (
        item: UINode,
        params?: { offset: number; limit: number; sort: string[] }
    ) => Promise<{ data: UINode[]; total: number }>;
    /**
     * Pagination limit to use with fetchChildren()
     */
    fetchChildrenLimit?: number;
    /**
     * Read-only field, automatically set when fetching children using fetchChildren()
     */
    fetchChildrenTotal?: number;
    actions?: UINode[];
    /**
     * Whether or not to translate the `name` property
     */
    translate?: boolean;
}
