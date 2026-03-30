import { CoreEventType } from '../types/core-event-type';
import { CoreEvent } from './core-event';

export interface EventSourceListener {
    events: CoreEventType[];
    callback: (event: CoreEvent) => any;
}
