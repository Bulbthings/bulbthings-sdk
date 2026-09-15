import { JSONSchema7 } from 'json-schema';

/** `inputType: 'entity'` */
export interface EntityInputParams {
    entityTypes?: string[];
    /** RQL filter restricting the pickable entities */
    filter?: string;
    /** Hide entities already picked elsewhere in the same array */
    hideSelectedEntities?: boolean;
}

/**
 * `inputType: 'checklist'` on an object whose properties are the items to
 * check (one object sub-schema each, typically keyed by entity id). An item is
 * checked when its key is present in the value.
 */
export interface ChecklistInputParams {
    /** Group items under collapsible sections (asset category for assets) */
    groupBy?: 'category';
    /** The form is invalid until every item is checked */
    requireAll?: boolean;
}

/** Item of a checklist */
export interface ChecklistItemInputParams {
    /** Entity the item stands for: avatar, sub-assets, category, code scan */
    entityId?: string;
}

export interface JsonSchema extends JSONSchema7 {
    inputType?:
        | 'file'
        | 'files'
        | 'entity'
        | 'entityType'
        | 'signature'
        | 'checklist';
    inputParams?: EntityInputParams &
        ChecklistInputParams &
        ChecklistItemInputParams & { [key: string]: any };
    mediaTypes?: string[];
    propertyOrder?: string[];
    enumNames?: string[];
    display?: {
        icon?: { fontAwesome?: string[] | string };
        numberFormat?: {
            maximumFractionDigits?: number;
            minimumFractionDigits?: number;
        };
        ranges?: {
            displayValue?: any;
            schema?: JsonSchema;
            style?: { backgroundColor?: string; color?: string };
        }[];
        style?: { backgroundColor?: string; color?: string };
    };
}
