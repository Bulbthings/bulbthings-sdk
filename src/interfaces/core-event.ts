import { CoreEventType } from '../types/core-event-type';

export interface CoreEvent {
    type: CoreEventType;
    data: {
        keyId?: string;
        resource: any;
        previousData?: any;
    };
}
