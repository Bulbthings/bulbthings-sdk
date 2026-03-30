import { Mutex } from 'async-mutex';
import EventSource from 'cross-eventsource';
import 'reflect-metadata';
import { BulbthingsOptions } from './interfaces/bulbthings-options';
import { CoreEvent } from './interfaces/core-event';
import { EventSourceListener } from './interfaces/eventsource-listener';
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
import { allEventTypes, CoreEventType } from './types/core-event-type';

// Export JSONAPI Error class to parse errors
export { DocWithErrors as ApiError } from 'jsonapi-typescript';
export * from './interfaces/core-event';
export * from './interfaces/json-api-options';
export * from './interfaces/ui-node';
export * from './types/core-event-type';
// Export all models
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
    files = new FileResource(this);
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
    listeners: EventSourceListener[] = [];
    private eventSource: EventSource;
    private retrySeconds = 1;
    private eventSourceMutex = new Mutex();

    /**
     * Subscribe to real-time events of the API
     * @param types Types of events to subscribe to
     * @param callback Event handler function
     */
    on(types: CoreEventType[] | '*', callback: (event: CoreEvent) => any) {
        const events = [...(types === '*' ? allEventTypes : types)];
        const subscription: EventSourceListener = { events, callback };
        this.listeners.push(subscription);
        // Return a function to unsubscribe
        return () =>
            this.listeners.splice(this.listeners.indexOf(subscription), 1);
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

    private async getEventSourceCode(): Promise<string | null> {
        try {
            if (!this.options.apiToken) {
                return null;
            }

            const res = await fetch(`${this.options.eventsUrl}/auth`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${this.options.apiToken}` },
            });

            if (res.status >= 400) {
                throw await res.json();
            }

            const { code } = await res.json();
            return code;
        } catch (err) {
            console.error('[bulbthings][getEventSourceCode]', err);
            return null;
        }
    }

    private async connectEventSource() {
        const release = await this.eventSourceMutex.acquire();
        try {
            if (this.options.disableEvents) {
                return;
            }

            this.disconnectEventSource();
            console.log('[bulbthings] connecting...');

            const code = (await this.getEventSourceCode()) || '';
            const workspaceId = this.options.companyId || '';

            this.eventSource = new EventSource(
                `${this.options.eventsUrl}/feed?code=${code}&workspaceId=${workspaceId}`
            );

            this.eventSource.addEventListener('open', () => {
                console.log('[bulbthings] connected.');
                this.retrySeconds = 1;
            });

            // Listen to all messages
            this.eventSource.addEventListener('message', (event) => {
                try {
                    console.log('event source message', event);
                    const coreEvent = JSON.parse(event.data) as CoreEvent;
                    console.log('coreEvent', coreEvent);
                    this.listeners
                        .filter((l) => l.events.includes(coreEvent.type))
                        .forEach((l) => {
                            try {
                                l.callback(coreEvent);
                            } catch (err) {
                                console.error(
                                    '[bulbthings] callback error',
                                    err
                                );
                            }
                        });
                } catch (err) {
                    console.error('[bulbthings] error processing event', err);
                }
            });

            // Handle disconnect errors
            this.eventSource.addEventListener('error', () => {
                this.disconnectEventSource();
                console.warn(
                    `[bulbthings] disconnected, retrying in ${this.retrySeconds} seconds`
                );

                setTimeout(() => {
                    this.connectEventSource();
                    // Exponential retry to avoid spamming the server
                    this.retrySeconds = Math.min(60, this.retrySeconds * 2);
                }, this.retrySeconds * 1000);
            });
        } catch (err) {
            console.error(`[bulbthings][connectEventSource]`, err);
        } finally {
            release();
        }
    }

    private disconnectEventSource() {
        if (this.eventSource) {
            console.log('[bulbthings] closing event feed...');
            this.eventSource.close();
        }
    }
}
