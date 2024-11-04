import { JSONSchema7 } from 'json-schema';

export interface JsonSchema extends JSONSchema7 {
    inputType?: 'file' | 'files' | 'entity' | 'entityType' | 'signature';
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
