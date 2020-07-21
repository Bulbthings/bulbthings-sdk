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
} from './models';
import { CoreEventType } from './types/core-event-type';
import { CoreEvent } from './interfaces/core-event';
import { BulbThingsOptions } from './interfaces/bulbthings-options';
import { UiResource } from './resources/ui';
import { NavigationResource } from './resources/navigation-resource';
import { LanguageResource } from './resources/language-resource';

// Export JSONAPI Error class to parse errors
export { DocWithErrors as ApiError } from 'jsonapi-typescript';

// Export all models so they can be used from outside
export * from './models';

export class BulbThings {
    // API resources
    accounts = new Resource<Account>(this, Account);
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
    events = new Resource<Event>(this, Event);
    eventTypes = new Resource<EventType>(this, EventType);
    files = new FileResource<File>(this, File);
    hooks = new Resource<Hook>(this, Hook);
    keys = new Resource<Key>(this, Key);
    language = new LanguageResource(this);
    measurements = new Resource<Measurement>(this, Measurement);
    memberships = new Resource<Membership>(this, Membership);
    navigationResource = new NavigationResource(this);
    permissions = new Resource<Permission>(this, Permission);
    roles = new Resource<Role>(this, Role);
    settingTypes = new Resource<SettingType>(this, SettingType);
    settings = new Resource<Setting>(this, Setting);
    ui = new UiResource(this);
    timeSeries = new TimeSeriesResource(this);
    units = new ReadonlyResource<Unit>(this, Unit);
    unitSettings = new Resource<UnitSetting>(this, UnitSetting);

    // Options
    options: BulbThingsOptions = {
        coreUrl: 'https://api.bulbthings.com',
        eventsUrl: 'https://events.bulbthings.com',
    };

    // Event Source interface for Server-Sent Events (SSE)
    private eventSource: EventSource;

    on(type: CoreEventType, listener: (event: CoreEvent) => void) {
        this.eventSource.addEventListener(type, (evt) => {
            listener(<CoreEvent>{
                type,
                data: JSON.parse(evt['data']),
            });
        });
    }

    setToken(token: string) {
        this.options.apiToken = token;
        // TODO: Reset EventSource when token changes
    }

    setCompanyId(companyId: string) {
        this.options.companyId = companyId;
    }

    constructor(options: BulbThingsOptions = {}) {
        // Options init
        this.options = { ...this.options, ...options };

        // Connecting to server-sent events
        this.eventSource = new EventSource(`${this.options.eventsUrl}/connect`);
        this.eventSource.onerror = (evt) => console.error('Error!', evt);
    }
}
