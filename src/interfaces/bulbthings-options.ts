export interface BulbthingsOptions {
    apiToken?: string;
    coreUrl?: string;
    eventsUrl?: string;
    companyId?: string;
    environment?: string;
    clientId?: string;
    geoPosition?: { lat: number; lng: number };
    log?: boolean;
    disableEvents?: boolean;
}
