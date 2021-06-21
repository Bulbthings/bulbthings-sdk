import { JSONSchema7 } from 'json-schema';

export interface JsonSchema extends JSONSchema7 {
    inputType?: string;
    mediaTypes?: string[];
}
