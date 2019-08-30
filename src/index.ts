import 'reflect-metadata';
import EventSource from 'cross-eventsource';
import { Resource, ReadonlyResource } from './resources/resource';
import { TimeSeriesResource } from './resources/time-series';
import { FileResource } from './resources/file';
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
    Team
} from './models';
import { CoreEventType } from './types/core-event-type';
import { CoreEvent } from './interfaces/core-event';
import { BulbThingsOptions } from './interfaces/bulbthings-options';

// Export all models so they can be used from outside
export * from './models';

export class BulbThings {
    // API resources
    companies = new Resource<Company>(this, Company);
    teams = new Resource<Team>(this, Team);
    accounts = new Resource<Account>(this, Account);
    keys = new Resource<Key>(this, Key);
    memberships = new Resource<Membership>(this, Membership);
    entities = new Resource<Entity>(this, Entity);
    entityTypes = new Resource<EntityType>(this, EntityType);
    attributeTypes = new Resource<AttributeType>(this, AttributeType);
    measurements = new Resource<Measurement>(this, Measurement);
    associations = new Resource<Association>(this, Association);
    associationTypes = new Resource<AssociationType>(this, AssociationType);
    eventTypes = new Resource<EventType>(this, EventType);
    events = new Resource<Event>(this, Event);
    actionTypes = new Resource<ActionType>(this, ActionType);
    actions = new Resource<Action>(this, Action);
    hooks = new Resource<Hook>(this, Hook);
    timeSeries = new TimeSeriesResource(this);
    units = new ReadonlyResource<Unit>(this, Unit);
    files = new FileResource<File>(this, File);

    // Options
    options: BulbThingsOptions = {
        coreUrl: 'https://core-v2.bulbthings.com',
        eventsUrl: 'https://events.bulbthings.com'
    };

    // Event Source interface for Server-Sent Events (SSE)
    private eventSource: EventSource;

    on(type: CoreEventType, listener: (event: CoreEvent) => void) {
        this.eventSource.addEventListener(type, evt => {
            listener(<CoreEvent>{
                type,
                data: JSON.parse(evt['data'])
            });
        });
    }

    constructor(options: BulbThingsOptions = {}) {
        // TODO: Authentication

        // Options init
        this.options = { ...this.options, ...options };

        // Connecting to server-sent events
        this.eventSource = new EventSource(`${this.options.eventsUrl}/connect`);
        this.eventSource.onerror = evt => console.error('Error!', evt);
    }
}
