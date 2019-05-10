/**
 * This file was automatically generated.
 * DO NOT MODIFY IT MANUALLY.
 * Update the corresponding JSON Schema in schemas/models and run
 * 'npm run types' to regenerate the interfaces.
 */
export interface BulbError {
    errors:   Error[];
    jsonapi?: Jsonapi;
    links?:   { [key: string]: LinkObject | string };
    meta?:    { [key: string]: any };
}

export interface Error {
    /**
     * An application-specific error code, expressed as a string value.
     */
    code: Code;
    /**
     * A human-readable explanation specific to this occurrence of the problem.
     */
    detail?: string;
    /**
     * A unique identifier for this particular occurrence of the problem.
     */
    id?:     string;
    links?:  { [key: string]: LinkObject | string };
    meta?:   { [key: string]: any };
    source?: Source;
    /**
     * The HTTP status code applicable to this problem, expressed as a string value.
     */
    status?: string;
    /**
     * A short, human-readable summary of the problem. It **SHOULD NOT** change from occurrence
     * to occurrence of the problem, except for purposes of localization.
     */
    title: string;
}

/**
 * A string containing the link's URL.
 */
export enum Code {
    API = "api",
    Connection = "connection",
    SDK = "sdk",
}

export interface LinkObject {
    /**
     * A string containing the link's URL.
     */
    href:  string;
    meta?: { [key: string]: any };
}

export interface Source {
    /**
     * A string indicating which query parameter caused the error.
     */
    parameter?: string;
    /**
     * A JSON Pointer [RFC6901] to the associated entity in the request document [e.g. "/data"
     * for a primary data object, or "/data/attributes/title" for a specific attribute].
     */
    pointer?: string;
}

/**
 * An object describing the server's implementation
 */
export interface Jsonapi {
    meta?:    { [key: string]: any };
    version?: string;
}
