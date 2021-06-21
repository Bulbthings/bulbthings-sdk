import { JSONSchema7 } from 'json-schema';

export interface JsonSchema extends JSONSchema7 {
    inputType?: 'file' | 'textarea';
    mediaTypes?: string[];
}
