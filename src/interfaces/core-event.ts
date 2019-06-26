import { CoreEventType } from '../types/core-event-type';

export interface CoreEvent {
    type: CoreEventType;
    data: {
        resource: any;
        previousData?: any;
    };
}
