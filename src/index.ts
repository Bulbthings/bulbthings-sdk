import 'reflect-metadata';
import EventSource from 'cross-eventsource';
import { Resource } from './resources/resource';
import { ReadonlyResource } from './resources/readonly-resource';
import { FileResource } from './resources/file-resource';
import { TimeSeriesResource } from './resources/time-series';
import { AuthenticationResource } from './resources/authentication-resource';

import {
    Entity,
    EntityType,
    AttributeType,
    Measurement,
    Association,
    AssociationType,
    Unit,
    UnitType,
    EventType,
    Event,
    ActionType,
    Action,
    Hook,
    File,
    Company,
    Account,
    Key,
    Membership,
    Role,
    Permission,
    Catalog,
    CatalogMapping,
    Code,
    EntityTypeMapping,
    UnitSetting,
    SettingType,
    Setting,
    Path,
    Grant,
    Environment,
    Acknowledgement,
} from './models';
import { allEventTypes, CoreEventType } from './types/core-event-type';
import { CoreEvent } from './interfaces/core-event';
import { BulbthingsOptions } from './interfaces/bulbthings-options';

// Export JSONAPI Error class to parse errors
export { DocWithErrors as ApiError } from 'jsonapi-typescript';

// Export all models so they can be used from outside
export * from './models';
export * from './interfaces/ui-node';

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
    codes = new Resource<Code>(this, Code);
    catalogs = new Resource<Catalog>(this, Catalog);
    catalogMappings = new Resource<CatalogMapping>(this, CatalogMapping);
    companies = new Resource<Company>(this, Company);
    entities = new Resource<Entity>(this, Entity);
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
    paths = new ReadonlyResource<Path>(this, Path);
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

    // Event Source interface for Server-Sent Events (SSE)
    private eventSource: EventSource;
    private listeners: { type: CoreEventType; listener: EventListener }[] = [];
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
            this.eventSource.addEventListener(type, listener);
            subscriptions.push({ type, listener });
        }

        this.listeners.push(...subscriptions);

        // Return a function to unsubscribe
        return () =>
            subscriptions.forEach((s) => {
                const idx = this.listeners.findIndex((x) => x === s);
                this.listeners.splice(idx, 1);
                this.eventSource.removeEventListener(s.type, s.listener);
            });
    }

    setToken(token: string) {
        this.options.apiToken = token;
        // TODO: Reset EventSource when token changes
        // this.initEventSource();
    }

    setCompanyId(companyId: string) {
        this.options.companyId = companyId;
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
        this.initEventSource();
    }

    private initEventSource() {
        console.log('[eventSource] connecting...');
        this.eventSource = new EventSource(`${this.options.eventsUrl}/connect`);

        this.eventSource.onopen = () => {
            console.log('[eventSource] connected.');
            this.retrySeconds = 1;
        };

        // Handle disconnect errors
        this.eventSource.onerror = () => {
            this.eventSource.close();
            console.warn(
                `[eventSource] disconnected, retrying in ${this.retrySeconds} seconds`
            );

            setTimeout(() => {
                this.initEventSource();
                // Exponential retry to avoid spamming the server
                this.retrySeconds = Math.min(60, this.retrySeconds * 2);
            }, this.retrySeconds * 1000);
        };

        // Reconnect all the listeners
        this.listeners.forEach((l) =>
            this.eventSource.addEventListener(l.type, l.listener)
        );
    }
}
