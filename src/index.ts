import EventSource from 'cross-eventsource';
import 'reflect-metadata';
import { BulbthingsOptions } from './interfaces/bulbthings-options';
import { CoreEvent } from './interfaces/core-event';
import {
    Account,
    Acknowledgement,
    Action,
    ActionType,
    Association,
    AssociationType,
    AttributeType,
    Catalog,
    CatalogMapping,
    Code,
    Company,
    EntityType,
    EntityTypeMapping,
    Environment,
    Event,
    EventType,
    File,
    Grant,
    Hook,
    Key,
    Measurement,
    Membership,
    Permission,
    Role,
    Setting,
    SettingType,
    Unit,
    UnitSetting,
    UnitType,
} from './models';
import { AuthenticationResource } from './resources/authentication-resource';
import { CacheResource } from './resources/cache-resource';
import { EntityResource } from './resources/entity-resource';
import { FileResource } from './resources/file-resource';
import { PathResource } from './resources/path-resource';
import { ReadonlyResource } from './resources/readonly-resource';
import { Resource } from './resources/resource';
import { TimeSeriesResource } from './resources/time-series';
import { CoreEventType, allEventTypes } from './types/core-event-type';

// Export JSONAPI Error class to parse errors
export { DocWithErrors as ApiError } from 'jsonapi-typescript';
export * from './interfaces/ui-node';
export * from './types/core-event-type';
// Export all models so they can be used from outside
export * from './models';

export class Bulbthings {
    // API resources
    accounts = new Resource<Account>(this, Account);
    acknowledgements = new Resource<Acknowledgement>(this, Acknowledgement);
    actions = new Resource<Action>(this, Action);
    actionTypes = new Resource<ActionType>(this, ActionType);
    associations = new Resource<Association>(this, Association);
    associationTypes = new Resource<AssociationType>(this, AssociationType);
    attributeTypes = new Resource<AttributeType>(this, AttributeType);
    authentication = new AuthenticationResource(this);
    cache = new CacheResource();
    codes = new Resource<Code>(this, Code);
    catalogs = new Resource<Catalog>(this, Catalog);
    catalogMappings = new Resource<CatalogMapping>(this, CatalogMapping);
    companies = new Resource<Company>(this, Company);
    entities = new EntityResource(this);
    entityTypeMappings = new Resource<EntityTypeMapping>(
        this,
        EntityTypeMapping
    );
    entityTypes = new Resource<EntityType>(this, EntityType);
    environments = new Resource<Environment>(this, Environment);
    events = new Resource<Event>(this, Event);
    eventTypes = new Resource<EventType>(this, EventType);
    files = new FileResource<File>(this, File);
    grants = new Resource<Grant>(this, Grant);
    hooks = new Resource<Hook>(this, Hook);
    keys = new Resource<Key>(this, Key);
    measurements = new Resource<Measurement>(this, Measurement);
    memberships = new Resource<Membership>(this, Membership);
    paths = new PathResource(this);
    permissions = new Resource<Permission>(this, Permission);
    roles = new Resource<Role>(this, Role);
    settingTypes = new Resource<SettingType>(this, SettingType);
    settings = new Resource<Setting>(this, Setting);
    timeSeries = new TimeSeriesResource(this);
    units = new ReadonlyResource<Unit>(this, Unit);
    unitTypes = new ReadonlyResource<UnitType>(this, UnitType);
    unitSettings = new Resource<UnitSetting>(this, UnitSetting);

    // Options
    options: BulbthingsOptions = {
        coreUrl: 'https://api.bulbthings.com',
        eventsUrl: 'https://events.bulbthings.com',
    };

    // Server-Sent Events (SSE)
    listeners: { type: CoreEventType; listener: EventListener }[] = [];
    private eventSource: EventSource;
    private retrySeconds = 1;

    /**
     * Subscribe to real-time events of the API
     * @param types Types of events to subscribe to
     * @param callback Event handler function
     */
    on(types: CoreEventType[] | '*', callback: (event: CoreEvent) => void) {
        const subscriptions: {
            type: CoreEventType;
            listener: EventListener;
        }[] = [];

        for (const type of types === '*' ? allEventTypes : types) {
            const listener: EventListener = (evt) =>
                callback(<CoreEvent>{ type, data: JSON.parse(evt['data']) });
            this.eventSource?.addEventListener(type, listener);
            subscriptions.push({ type, listener });
        }

        this.listeners.push(...subscriptions);

        // Return a function to unsubscribe
        return () =>
            subscriptions.forEach((s) => {
                const idx = this.listeners.findIndex((x) => x === s);
                this.listeners.splice(idx, 1);
                this.eventSource?.removeEventListener(s.type, s.listener);
            });
    }

    setToken(token: string) {
        this.options.apiToken = token;
        this.cache.clear();
        this.connectEventSource();
    }

    setCompanyId(companyId: string) {
        this.options.companyId = companyId;
        this.connectEventSource();
    }

    setEnvironment(environment: string) {
        this.options.environment = environment;
    }

    setGeoPosition(pos: { lat: number; lng: number }) {
        this.options.geoPosition = pos;
    }

    constructor(options: BulbthingsOptions = {}) {
        // Initialise options
        this.options = { ...this.options, ...options };
        // Connect to server-sent events
        this.connectEventSource();
    }

    private connectEventSource() {
        if (this.options.disableEvents) {
            return;
        }

        this.disconnectEventSource();
        console.log('[eventSource] connecting...');
        this.eventSource = new EventSource(
            `${this.options.eventsUrl}/connect?workspaceId=${
                this.options.companyId || ''
            }`
        );

        this.eventSource.onopen = () => {
            console.log('[eventSource] connected.');
            this.retrySeconds = 1;
        };

        // Handle disconnect errors
        this.eventSource.onerror = () => {
            this.disconnectEventSource();
            console.warn(
                `[eventSource] disconnected, retrying in ${this.retrySeconds} seconds`
            );

            setTimeout(() => {
                this.connectEventSource();
                // Exponential retry to avoid spamming the server
                this.retrySeconds = Math.min(60, this.retrySeconds * 2);
            }, this.retrySeconds * 1000);
        };

        // Reconnect all the listeners
        this.listeners.forEach((l) =>
            this.eventSource.addEventListener(l.type, l.listener)
        );
    }

    private disconnectEventSource() {
        if (this.eventSource) {
            console.log('[eventSource] closing...');
            this.eventSource.close();
        }
    }
}
